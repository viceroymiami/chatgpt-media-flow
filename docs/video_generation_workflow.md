# Video Generation Workflows
This document contains `window.FLOW` configurations for workflows that involve generating video outputs.

## Text-to-Video Workflow
This is an example for generating video directly from a text description using Seedance.

```json
{
  "name": "Video Generation",
  "nodes": [
    {
      "id": "1",
      "type": "textInput",
      "position": {
        "x": 63,
        "y": 148
      },
      "data": {
        "prompt": "A serene ocean wave crashing on a beach, slow motion",
        "label": "Video Description"
      },
      "width": 320,
      "height": 170,
      "selected": false
    },
    {
      "id": "2",
      "type": "model",
      "position": {
        "x": 450,
        "y": 150
      },
      "data": {
        "model": "bytedance/seedance-1-lite",
        "width": 1280,
        "height": 720,
        "outputCount": 1,
        "label": "Video",
        "backgroundColor": "#8b5cf6",
        "name": "Seedance 1 Lite"
      },
      "width": 320,
      "height": 412,
      "selected": true
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

## Video Generation With a Starting Frame
This is an example where the user first generates an image to use as a starting frame to a video and then uses that to generate the video. This sort of workflow can offer greater control over video generation.

```json
{
  "name": "Video Generation",
  "nodes": [
    {
      "id": "1",
      "type": "textInput",
      "position": {
        "x": -138.8458625592902,
        "y": 306.28965011228547
      },
      "data": {
        "prompt": "A realistic photo of a tomato with a human baby face. Closed eyes. Close-up, wooden table, tilt shift, narrow field of view.",
        "label": "Video Description",
        "name": "Prompt Text",
        "status": "complete"
      },
      "width": 320,
      "height": 172,
      "selected": false
    },
    {
      "id": "0hn8dj",
      "type": "model",
      "position": {
        "x": 253.78839287294147,
        "y": 242.86948638695014
      },
      "data": {
        "label": "Model",
        "model": "black-forest-labs/flux-schnell",
        "name": "Flux Schnell",
        "aspectRatio": "1:1",
        "outputCount": 1,
        "output": "https://images.subscribe.dev/uploads/65edd645-8a86-4f19-a7da-66d01c9fdbcb/example@email.com/1758073284546-out-0.webp",
        "outputs": [
          "https://images.subscribe.dev/uploads/65edd645-8a86-4f19-a7da-66d01c9fdbcb/example@email.com/1758073284546-out-0.webp"
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
      "id": "4lirto",
      "type": "textInput",
      "position": {
        "x": 255.85351154908636,
        "y": 38.76515737589614
      },
      "data": {
        "label": "Prompt Text",
        "prompt": "A tomato is getting slowly cut in half by a giant knife.",
        "status": "complete"
      },
      "width": 320,
      "height": 172,
      "selected": false
    },
    {
      "id": "yaxdrj",
      "type": "model",
      "position": {
        "x": 708.6655666205257,
        "y": 176.4873674574588
      },
      "data": {
        "label": "Model",
        "model": "wan-video/wan-2.2-5b-fast",
        "name": "WAN",
        "aspectRatio": "16:9",
        "outputCount": 1,
        "output": "https://images.subscribe.dev/uploads/65edd645-8a86-4f19-a7da-66d01c9fdbcb/example@email.com/1758073302570-output.mp4",
        "outputs": [
          "https://images.subscribe.dev/uploads/65edd645-8a86-4f19-a7da-66d01c9fdbcb/example@email.com/1758073302570-output.mp4"
        ],
        "outputStatuses": [
          "complete"
        ],
        "outputType": "video",
        "status": "complete"
      },
      "width": 320,
      "height": 256,
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
      "source": "1",
      "sourceHandle": "prompt",
      "target": "0hn8dj",
      "targetHandle": "prompt",
      "id": "reactflow__edge-1prompt-0hn8djprompt"
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
      "source": "4lirto",
      "sourceHandle": "prompt",
      "target": "yaxdrj",
      "targetHandle": "prompt",
      "id": "reactflow__edge-4lirtoprompt-yaxdrjprompt"
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
      "source": "0hn8dj",
      "sourceHandle": "image",
      "target": "yaxdrj",
      "targetHandle": "image",
      "id": "reactflow__edge-0hn8djimage-yaxdrjimage"
    }
  ]
}
```