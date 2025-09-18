# Basic Image Workflow
This document contains the `window.FLOW` configuration for a simple text-to-image workflow using Flux Schnell:

```json
{
  "name": "Basic Image Generation",
  "nodes": [
    {
      "id": "1",
      "type": "textInput",
      "position": {
        "x": -138.94743443252977,
        "y": 150.83049051109532
      },
      "data": {
        "prompt": "A majestic mountain landscape at sunset",
        "label": "Text Prompt"
      },
      "width": 320,
      "height": 170,
      "selected": true
    },
    {
      "id": "2",
      "type": "model",
      "position": {
        "x": 400,
        "y": 150
      },
      "data": {
        "model": "google/nano-banana",
        "width": 1024,
        "height": 768,
        "outputCount": 1,
        "label": "Flux Schnell"
      },
      "width": 320,
      "height": 571
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2",
      "sourceHandle": "prompt",
      "targetHandle": "prompt",
      "type": "custom",
      "style": {
        "stroke": "#4b5563",
        "strokeWidth": 2
      },
      "animated": false
    }
  ]
}
```