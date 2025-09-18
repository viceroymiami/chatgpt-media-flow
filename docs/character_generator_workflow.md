# Character Generator Workflow
This document contains the `window.FLOW` configuration for a character generator workflow that creates fantasy TTRPG characters and weapons, then combines them:

```json
{
  "name": "Character Generator",
  "nodes": [
    {
      "id": "ozlxl5",
      "type": "model",
      "position": {
        "x": 672.0621798811268,
        "y": 431.5763085854969
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
      "id": "blea5b",
      "type": "model",
      "position": {
        "x": 670.4374364111688,
        "y": 902.5240234784522
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
      "id": "b6wgg9",
      "type": "textInput",
      "position": {
        "x": -113.31691118298455,
        "y": 428.93578323917063
      },
      "data": {
        "label": "Prompt Text",
        "prompt": "Write an image prompt that describes a fantasy medieval weapon for a TTRPG character. Provide only the raw prompt, and no other text. The item should be on a white background."
      },
      "width": 320,
      "height": 170,
      "selected": false
    },
    {
      "id": "lu8gqo",
      "type": "model",
      "position": {
        "x": 284.10485899175995,
        "y": 419.53952962893766
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
      "id": "e4v7e5",
      "type": "model",
      "position": {
        "x": 275.4556124842153,
        "y": 907.3396126732307
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
      "id": "9hma0a",
      "type": "textInput",
      "position": {
        "x": -111.67860805268192,
        "y": 911.1265575237423
      },
      "data": {
        "label": "Prompt Text",
        "prompt": "Generate an image prompt that will create a picture of a fantasy TTRPG character. Return only the raw prompt, and no other text. The character should be on a white background. The character should hold no items in its hands on on its person, and should be alone (with no other characters, entities, animals...)."
      },
      "width": 320,
      "height": 170,
      "selected": false
    },
    {
      "id": "gy4hz2",
      "type": "textInput",
      "position": {
        "x": 1122.6435056893567,
        "y": 543.3452242968717
      },
      "data": {
        "label": "Prompt Text",
        "prompt": "The reference medieval fantasy character poses ferociously, holding the reference weapon."
      },
      "width": 320,
      "height": 170,
      "selected": false
    },
    {
      "id": "aofhr7",
      "type": "model",
      "position": {
        "x": 1126.067768816176,
        "y": 747.8768820765093
      },
      "data": {
        "label": "Model",
        "model": "google/nano-banana",
        "name": "Final Composite",
        "aspectRatio": "1:1",
        "outputCount": 1,
        "outputType": "image"
      },
      "width": 320,
      "height": 412,
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
      "source": "b6wgg9",
      "sourceHandle": "prompt",
      "target": "lu8gqo",
      "targetHandle": "prompt",
      "id": "reactflow__edge-b6wgg9prompt-lu8gqoprompt"
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
      "source": "lu8gqo",
      "sourceHandle": "text",
      "target": "ozlxl5",
      "targetHandle": "prompt",
      "id": "reactflow__edge-lu8gqotext-ozlxl5prompt"
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
      "source": "9hma0a",
      "sourceHandle": "prompt",
      "target": "e4v7e5",
      "targetHandle": "prompt",
      "id": "reactflow__edge-9hma0aprompt-e4v7e5prompt"
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
      "source": "e4v7e5",
      "sourceHandle": "text",
      "target": "blea5b",
      "targetHandle": "prompt",
      "id": "reactflow__edge-e4v7e5text-blea5bprompt"
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
      "source": "gy4hz2",
      "sourceHandle": "prompt",
      "target": "aofhr7",
      "targetHandle": "prompt",
      "id": "reactflow__edge-gy4hz2prompt-aofhr7prompt",
      "selected": false
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
      "source": "ozlxl5",
      "sourceHandle": "image",
      "target": "aofhr7",
      "targetHandle": "image_1",
      "id": "reactflow__edge-ozlxl5image-aofhr7image_1",
      "selected": false
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
      "source": "blea5b",
      "sourceHandle": "image",
      "target": "aofhr7",
      "targetHandle": "image_2",
      "id": "reactflow__edge-blea5bimage-aofhr7image_2",
      "selected": false
    }
  ]
}
```