# Multi-Image Workflows
This document contains `window.FLOW` configurations for workflows that involve images as inputs. Such workflows are suited for image modification, image bashing, and using references.

## Image Modification Example
Here is an example of changing the style of an image, using Flux Kontext.

```json
{
  "name": "Image-to-Image Generation",
  "nodes": [
    {
      "id": "1",
      "type": "textInput",
      "position": {
        "x": -62.12320453187564,
        "y": 174.21104184843568
      },
      "data": {
        "prompt": "Transform this into a cyberpunk style",
        "label": "Style Prompt",
        "backgroundColor": "#1f2937"
      },
      "width": 320,
      "height": 170,
      "selected": false
    },
    {
      "id": "2",
      "type": "imageInput",
      "position": {
        "x": -59.70327925420929,
        "y": 358.08999573576506
      },
      "data": {
        "label": "Source Image"
      },
      "width": 320,
      "height": 222,
      "selected": false
    },
    {
      "id": "3",
      "type": "model",
      "position": {
        "x": 506.4767122173208,
        "y": 163.7129099067762
      },
      "data": {
        "model": "google/nano-banana",
        "width": 1024,
        "height": 1024,
        "outputCount": 1,
        "label": "Flux Kontext",
        "name": "Cyberpunkified Image",
        "backgroundColor": "#06b6d4"
      },
      "width": 320,
      "height": 412,
      "selected": false
    }
  ],
  "edges": [
    {
      "id": "e1-3",
      "source": "1",
      "target": "3",
      "sourceHandle": "prompt",
      "targetHandle": "prompt",
      "type": "custom",
      "style": {
        "stroke": "#4b5563",
        "strokeWidth": 2
      },
      "animated": false
    },
    {
      "id": "e2-3",
      "source": "2",
      "target": "3",
      "sourceHandle": "image",
      "targetHandle": "image_1",
      "type": "custom",
      "style": {
        "stroke": "#4b5563",
        "strokeWidth": 2
      },
      "animated": false
    },
    {
      "type": "custom",
      "style": {
        "stroke": "#4b5563",
        "strokeWidth": 2
      },
      "animated": false,
      "deletable": true,
      "source": "2",
      "sourceHandle": "image",
      "target": "3",
      "targetHandle": "input_image",
      "id": "reactflow__edge-2image-3input_image"
    }
  ]
}
```

## Image Bashing Example
Here is a workflow using Flux Schnell to generate two base images and then combining the images into one using Nano Banana.

```json
{
  "name": "Funny Dog Video Generator",
  "nodes": [
    {
      "id": "1",
      "type": "textInput",
      "position": {
        "x": 70,
        "y": 362.5
      },
      "data": {
        "prompt": "A realistic businessman in a suit. He is a Japanese salaryman, sitting at a restaurant, facing the camera. In front of him is a wooden table. The camera is looking down at him, from a slightly high angle.",
        "label": "Funny Dog Prompt",
        "name": "Dog Scene Description",
        "status": "complete"
      },
      "width": 320,
      "height": 172,
      "selected": false
    },
    {
      "id": "2",
      "type": "model",
      "position": {
        "x": 560,
        "y": 186.25
      },
      "data": {
        "model": "black-forest-labs/flux-schnell",
        "width": 1024,
        "height": 1024,
        "outputCount": 1,
        "label": "Dog Image Generator",
        "name": "Flux Schnell",
        "outputStatuses": [
          "complete"
        ],
        "status": "complete",
        "output": "https://images.subscribe.dev/uploads/65edd645-8a86-4f19-a7da-66d01c9fdbcb/example@email.com/1758067830586-out-0.webp",
        "outputs": [
          "https://images.subscribe.dev/uploads/65edd645-8a86-4f19-a7da-66d01c9fdbcb/example@email.com/1758067830586-out-0.webp"
        ],
        "outputType": "image"
      },
      "width": 320,
      "height": 404,
      "selected": false
    },
    {
      "id": "ajo4bc",
      "type": "textInput",
      "position": {
        "x": 71.17485792009398,
        "y": 683.0505034881503
      },
      "data": {
        "label": "Prompt Text",
        "prompt": "A pixel art of a bowl of ramen.",
        "status": "complete"
      },
      "width": 320,
      "height": 172,
      "selected": false
    },
    {
      "id": "9i899t",
      "type": "model",
      "position": {
        "x": 560.5312783422396,
        "y": 679.0101896464421
      },
      "data": {
        "label": "Model",
        "model": "black-forest-labs/flux-schnell",
        "name": "Flux Schnell",
        "aspectRatio": "1:1",
        "outputCount": 1,
        "output": "https://images.subscribe.dev/uploads/65edd645-8a86-4f19-a7da-66d01c9fdbcb/example@email.com/1758067838550-out-0.webp",
        "outputs": [
          "https://images.subscribe.dev/uploads/65edd645-8a86-4f19-a7da-66d01c9fdbcb/example@email.com/1758067838550-out-0.webp"
        ],
        "outputStatuses": [
          "complete"
        ],
        "outputType": "image",
        "status": "complete"
      },
      "width": 320,
      "height": 412,
      "selected": false
    },
    {
      "id": "l21nia",
      "type": "model",
      "position": {
        "x": 1199.6666475835764,
        "y": 400.95171571496104
      },
      "data": {
        "label": "Model",
        "model": "google/nano-banana",
        "name": "Nano Banana",
        "aspectRatio": "1:1",
        "outputCount": 1,
        "output": "https://images.subscribe.dev/uploads/65edd645-8a86-4f19-a7da-66d01c9fdbcb/example@email.com/1758067856817-tmp9hi2js09.jpeg",
        "outputs": [
          "https://images.subscribe.dev/uploads/65edd645-8a86-4f19-a7da-66d01c9fdbcb/example@email.com/1758067856817-tmp9hi2js09.jpeg"
        ],
        "outputStatuses": [
          "complete"
        ],
        "outputType": "image",
        "status": "complete"
      },
      "width": 320,
      "height": 412,
      "selected": false
    },
    {
      "id": "wxqiq1",
      "type": "textInput",
      "position": {
        "x": 556.8263571295508,
        "y": -14.887301996362506
      },
      "data": {
        "label": "Prompt Text",
        "prompt": "A japanese salaryman eating from a pixel art bowl of ramen. He is leaning over, chopsticks in hand, happily slurping up some ramen. Make sure to redraw the ramen and the salaryman so that they are properly integrated together.",
        "status": "complete"
      },
      "width": 320,
      "height": 172,
      "selected": false
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
      "animated": false,
      "data": {}
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
      "source": "ajo4bc",
      "sourceHandle": "prompt",
      "target": "9i899t",
      "targetHandle": "prompt",
      "id": "reactflow__edge-ajo4bcprompt-9i899tprompt"
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
      "source": "2",
      "sourceHandle": "image",
      "target": "l21nia",
      "targetHandle": "image_1",
      "id": "reactflow__edge-2image-l21niaimage_1"
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
      "source": "9i899t",
      "sourceHandle": "image",
      "target": "l21nia",
      "targetHandle": "image_2",
      "id": "reactflow__edge-9i899timage-l21niaimage_2"
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
      "source": "wxqiq1",
      "sourceHandle": "prompt",
      "target": "l21nia",
      "targetHandle": "prompt",
      "id": "reactflow__edge-wxqiq1prompt-l21niaprompt"
    }
  ]
}
```

