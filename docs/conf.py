# conf.py
import os
import sys
sys.path.insert(0, os.path.abspath('.'))

# Project information
project = 'Read the Docs Tutorial'
copyright = '2024, Your Name'
author = 'Your Name'
release = '0.1'

# General configuration
extensions = []

templates_path = ['_templates']
exclude_patterns = []

# HTML output
html_theme = 'alabaster'
html_static_path = ['_static']
