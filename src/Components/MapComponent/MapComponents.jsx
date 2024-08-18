import React, { useContext, useState, useEffect } from 'react';
import ImageMapper from 'react-image-mapper';
import areas from './areas.json';
import nodes from './node.json';
import NodeTooltip from './NodeTooltip.jsx';
import TargetTooltip from './TargetTooltip.jsx';
import { MainContext } from '../../hooks/useSimulationContext.jsx';
import { useFetchNodeAddresses, useFormatAndFetchURIData } from "../../hooks/useGetContract.jsx";



const MapComponent = () => {

    const { targetData, setTargetData, selectedNode, setClickedData, clickedData, address, setAddresses } = useContext(MainContext);

    const { result: addressResult } = useFetchNodeAddresses()
    useEffect(() => {
        if (addressResult) {
            console.log("🚀 ~ MapComponent ~ addressResult:", addressResult);
            setAddresses(addressResult);

            addressResult.forEach(async (ad) => {
                console.log("🚀 ~ addressResult.map ~ ar:", ad);
                const { data: URIformatterAddress } = await useFormatAndFetchURIData(ad);
                console.log("🚀 ~ MapComponent ~ URIformatterAddress:", URIformatterAddress);

            });
        }
    }, [addressResult, setAddresses]);


    const URL = "/x.jpg";
    const width = 2100;
    const height = 1200;
    const imgWidth = 1665;
    const imgHeight = 957;
    const nodeWidth = 1000;
    const nodeHeight = 500;

    const [tooltipData, setTooltipData] = useState({
        visible: false,
        area: {},
        position: { x: 0, y: 0 }
    });

    const scaleCoords = (coords, width, height) => {
        return coords.map((coord, index) => {
            return index % 2 === 0 ? coord * width : coord * height;
        });
    };

    const MAP = {
        name: "Map",
        areas: areas.map((area) => {
            return {
                name: area.name,
                shape: area.shape,
                preFillColor: area.preFillColor,
                fillColor: area.fillColor,
                coords: scaleCoords(area.coords, imgWidth, imgHeight)
            };
        })
    };

    /*//////////////////////////////////////////////////////////////
                               handle areaclick
    //////////////////////////////////////////////////////////////*/
    const handleAreaClick = (area, index, event) => {
        // console.log("area is: ", area);
        // console.log("Area clicked: ", area.name);



        /*//////////////////////////////////////////////////////////////
                      set length of the array when click
        //////////////////////////////////////////////////////////////*/
        setClickedData(prevData => {
            if (prevData.length < 7) {
                const newData = [...prevData, area.name];
                console.log('clickedData after adding new item:', newData);
                return newData;
            } else {

                // const {data: uriformat } =useFormatAndFetchURIData(clickedData)
                // console.log('uriformat is:',uriformat);
                alert('Length of clickedData is already enogh. No new item added.');
                return prevData;
            }
        });
        // console.log(clickedData);


        const x = event.clientX - 25;
        const y = event.clientY;



        /*//////////////////////////////////////////////////////////////
              Equalizing the clicked area with the data inside the card
        //////////////////////////////////////////////////////////////*/

        // setTargetData(prevData => {
        //     const updatedData = prevData.map((node, idx) => {
        //         if (idx === selectedNode - 1 ) {

        //             return {
        //                 ...node,
        //                 address: _area_.address,//URIDATAFORMAT /// nodeData (pref)
        //                 TargetLatitude: _area_.ipfsData,//send by front-ned
        //                 TargetLongitude: _area_.ipfsData, //send by front-ned
        //                 location: _area_.position, 
        //                 NodeLatitude: _area_.ipfsData, //URIDATAFORMAT
        //                 NodeLongitude: _area_.ipfsData, //URIDATAFORMAT
        //                 NodePositionName: _area_.ipfsData,// URIDATAFORMAT
        //             };
        //         }
        //         return node;
        //     });
        //     return updatedData;
        // });

        const adjustedX = Math.min(x, window.innerWidth - 500);
        const adjustedY = Math.min(y, window.innerHeight - 300);
        setTooltipData({ visible: true, areaId: area.name, position: { x: adjustedX, y: adjustedY } });
    };


    /*//////////////////////////////////////////////////////////////
                            the blue node
    //////////////////////////////////////////////////////////////*/
    const renderNodes = () => {
        return nodes.map((node, index) => {
            const scaledX = node.coords[0] * nodeWidth;
            const scaledY = node.coords[1] * nodeHeight;
            return (
                <div
                    key={index}
                    className='absolute top-80 text-2xl left-80 text-black bg-yellow-50 z-50'
                    style={{
                        left: `${scaledX}px`,
                        top: `${scaledY}px`,
                    }}
                >
                    <NodeTooltip
                        area={node}
                        visible={true}
                        position={{ x: scaledX, y: scaledY }}
                        radius={node.coords[2]}
                    />
                </div>
            );
        });
    };

    return (
        <div className="ml-48 mt-10">
            <div className="drop-shadow relative">
                <ImageMapper
                    src={URL}
                    map={MAP}
                    onClick={handleAreaClick}
                    width={width}
                    height={height}
                    imgWidth={imgWidth}
                    imgHeight={imgHeight}
                    strokeColor={"transparent"}
                    alt="Map Image"
                />
                {renderNodes()}
                {tooltipData.visible && (
                    <div
                        className='absolute z-50'
                        style={{
                            left: `${tooltipData.position.x}px`,
                            top: `${tooltipData.position.y}px`,
                        }}
                    >
                    </div>
                )}
            </div>

            <TargetTooltip
                className='z-50'
                areaId={tooltipData.area}
                visible={tooltipData.visible}
                position={tooltipData.position}
            />
        </div>
    );
};


export default MapComponent;

