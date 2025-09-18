# Interior Redesign Workflow
This document contains the `window.FLOW` configuration for an interior redesign workflow that takes an uploaded room image and creates three different style variations:

```json
{
  "name": "Interior Redesign",
  "nodes": [
    {
      "id": "ut3nmt",
      "type": "imageInput",
      "position": {
        "x": 283.6508718844168,
        "y": 257.9337661804626
      },
      "data": {
        "label": "Upload Image",
        "name": "Start here: Upload picture of room"
      },
      "width": 320,
      "height": 222,
      "selected": false
    },
    {
      "id": "ximqa0",
      "type": "model",
      "position": {
        "x": 757.5647299999999,
        "y": 221.8984375
      },
      "data": {
        "label": "Model",
        "model": "openai/gpt-4o",
        "name": "GPT-4o",
        "aspectRatio": "1:1",
        "outputCount": 1,
        "outputType": "text"
      },
      "width": 320,
      "height": 287,
      "selected": false
    },
    {
      "id": "93o0h8",
      "type": "model",
      "position": {
        "x": 757.5647299999999,
        "y": 550.7968749999999
      },
      "data": {
        "label": "Model",
        "model": "openai/gpt-4o",
        "name": "GPT-4o",
        "aspectRatio": "1:1",
        "outputCount": 1,
        "outputType": "text"
      },
      "width": 320,
      "height": 287,
      "selected": false
    },
    {
      "id": "g51wpc",
      "type": "model",
      "position": {
        "x": 757.5647299999999,
        "y": 879.69531
      },
      "data": {
        "label": "Model",
        "model": "openai/gpt-4o",
        "name": "GPT-4o",
        "aspectRatio": "1:1",
        "outputCount": 1,
        "outputType": "text"
      },
      "width": 320,
      "height": 287,
      "selected": false
    },
    {
      "id": "k8u7wp",
      "type": "model",
      "position": {
        "x": 1234.0647300000001,
        "y": 107.3984375
      },
      "data": {
        "label": "Model",
        "model": "google/nano-banana",
        "name": "Nano Banana",
        "aspectRatio": "1:1",
        "outputCount": 1,
        "outputType": "image"
      },
      "width": 320,
      "height": 412,
      "selected": false
    },
    {
      "id": "tnqgxg",
      "type": "model",
      "position": {
        "x": 1234.0647300000001,
        "y": 550.7968749999999
      },
      "data": {
        "label": "Model",
        "model": "google/nano-banana",
        "name": "Nano Banana",
        "aspectRatio": "1:1",
        "outputCount": 1,
        "outputType": "image"
      },
      "width": 320,
      "height": 412,
      "selected": false
    },
    {
      "id": "875ghx",
      "type": "model",
      "position": {
        "x": 1234.0647300000001,
        "y": 879.69531
      },
      "data": {
        "label": "Model",
        "model": "google/nano-banana",
        "name": "Nano Banana",
        "aspectRatio": "1:1",
        "outputCount": 1,
        "outputType": "image"
      },
      "width": 320,
      "height": 412,
      "selected": false
    },
    {
      "id": "ub6qf2",
      "type": "textInput",
      "position": {
        "x": 468.8647300000001,
        "y": 221.8984375
      },
      "data": {
        "label": "Prompt Text",
        "prompt": "Redesign this room in a modern minimalist style. Keep the same layout and basic structure, but update the furniture, colors, and decor to be clean, simple, and contemporary. The room should feel spacious and uncluttered."
      },
      "width": 320,
      "height": 170,
      "selected": false
    },
    {
      "id": "xrvd68",
      "type": "textInput",
      "position": {
        "x": 468.8647300000001,
        "y": 550.7968749999999
      },
      "data": {
        "label": "Prompt Text",
        "prompt": "Redesign this room in a cozy rustic style. Keep the same layout but add warm wood elements, natural textures, earth tones, and comfortable furnishings. The room should feel welcoming and homey."
      },
      "width": 320,
      "height": 170,
      "selected": false
    },
    {
      "id": "2s3nh7",
      "type": "textInput",
      "position": {
        "x": 468.8647300000001,
        "y": 879.69531
      },
      "data": {
        "label": "Prompt Text",
        "prompt": "Redesign this room in an elegant luxury style. Keep the same layout but upgrade everything to high-end finishes, rich colors, premium materials, and sophisticated furnishings. The room should feel opulent and refined."
      },
      "width": 320,
      "height": 170,
      "selected": false
    }
  ],
  "edges": [
    {
      "type": "custom",
      "style": {
        "stroke": "#4b5563",
        "strokeWidth": 2
      },
      "animated": false,
      "deletable": true,
      "data": {},
      "source": "ub6qf2",
      "sourceHandle": "prompt",
      "target": "ximqa0",
      "targetHandle": "prompt",
      "id": "reactflow__edge-ub6qf2prompt-ximqa0prompt"
    },
    {
      "type": "custom",
      "style": {
        "stroke": "#4b5563",
        "strokeWidth": 2
      },
      "animated": false,
      "deletable": true,
      "data": {},
      "source": "xrvd68",
      "sourceHandle": "prompt",
      "target": "93o0h8",
      "targetHandle": "prompt",
      "id": "reactflow__edge-xrvd68prompt-93o0h8prompt"
    },
    {
      "type": "custom",
      "style": {
        "stroke": "#4b5563",
        "strokeWidth": 2
      },
      "animated": false,
      "deletable": true,
      "data": {},
      "source": "2s3nh7",
      "sourceHandle": "prompt",
      "target": "g51wpc",
      "targetHandle": "prompt",
      "id": "reactflow__edge-2s3nh7prompt-g51wpcprompt"
    },
    {
      "type": "custom",
      "style": {
        "stroke": "#4b5563",
        "strokeWidth": 2
      },
      "animated": false,
      "deletable": true,
      "data": {},
      "source": "ut3nmt",
      "sourceHandle": "image",
      "target": "k8u7wp",
      "targetHandle": "image_1",
      "id": "reactflow__edge-ut3nmtimage-k8u7wpimage_1"
    },
    {
      "type": "custom",
      "style": {
        "stroke": "#4b5563",
        "strokeWidth": 2
      },
      "animated": false,
      "deletable": true,
      "data": {},
      "source": "ut3nmt",
      "sourceHandle": "image",
      "target": "tnqgxg",
      "targetHandle": "image_1",
      "id": "reactflow__edge-ut3nmtimage-tnqgxgimage_1"
    },
    {
      "type": "custom",
      "style": {
        "stroke": "#4b5563",
        "strokeWidth": 2
      },
      "animated": false,
      "deletable": true,
      "data": {},
      "source": "ut3nmt",
      "sourceHandle": "image",
      "target": "875ghx",
      "targetHandle": "image_1",
      "id": "reactflow__edge-ut3nmtimage-875ghximage_1"
    },
    {
      "type": "custom",
      "style": {
        "stroke": "#4b5563",
        "strokeWidth": 2
      },
      "animated": false,
      "deletable": true,
      "data": {},
      "source": "ximqa0",
      "sourceHandle": "text",
      "target": "k8u7wp",
      "targetHandle": "prompt",
      "id": "reactflow__edge-ximqa0text-k8u7wpprompt"
    },
    {
      "type": "custom",
      "style": {
        "stroke": "#4b5563",
        "strokeWidth": 2
      },
      "animated": false,
      "deletable": true,
      "data": {},
      "source": "93o0h8",
      "sourceHandle": "text",
      "target": "tnqgxg",
      "targetHandle": "prompt",
      "id": "reactflow__edge-93o0h8text-tnqgxgprompt"
    },
    {
      "type": "custom",
      "style": {
        "stroke": "#4b5563",
        "strokeWidth": 2
      },
      "animated": false,
      "deletable": true,
      "data": {},
      "source": "g51wpc",
      "sourceHandle": "text",
      "target": "875ghx",
      "targetHandle": "prompt",
      "id": "reactflow__edge-g51wpctext-875ghxprompt"
    }
  ]
}
```