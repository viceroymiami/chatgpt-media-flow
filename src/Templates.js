// Flow Templates - Pre-made workflow configurations from docs folder
import { MODELS_CONFIG } from './ModelConfig';

export const FLOW_TEMPLATES = {
  "Image Generation": {
    "Basic Image Generation": {
      description: "Simple text-to-image workflow using Flux Schnell",
      flow: {
        boardName: "Basic Image Generation",
        nodes: [
          {
            id: "1",
            type: "textInput",
            position: {
              x: -138.94743443252977,
              y: 150.83049051109532
            },
            data: {
              prompt: "A majestic mountain landscape at sunset",
              label: "Text Prompt"
            },
            width: 320,
            height: 170,
            selected: true
          },
          {
            id: "2",
            type: "model",
            position: {
              x: 400,
              y: 150
            },
            data: {
              model: "black-forest-labs/flux-schnell",
              width: 1024,
              height: 768,
              outputCount: 1,
              label: "Flux Schnell"
            },
            width: 320,
            height: 571
          }
        ],
        edges: [
          {
            id: "e1-2",
            source: "1",
            target: "2",
            sourceHandle: "prompt",
            targetHandle: "prompt",
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false
          }
        ]
      }
    },

    "Multi-Image Workflow": {
      description: "Complex workflow with multiple image inputs and combination",
      flow: {
        boardName: "Multi-Image Workflow",
        nodes: [
          {
            id: "1",
            type: "textInput",
            position: {
              x: 70,
              y: 362.5
            },
            data: {
              prompt: "A realistic businessman in a suit. He is a Japanese salaryman, sitting at a restaurant, facing the camera. In front of him is a wooden table. The camera is looking down at him, from a slightly high angle.",
              label: "Funny Dog Prompt",
              name: "Dog Scene Description",
              status: "complete"
            },
            width: 320,
            height: 172,
            selected: false
          },
          {
            id: "2",
            type: "model",
            position: {
              x: 560,
              y: 186.25
            },
            data: {
              model: "black-forest-labs/flux-schnell",
              width: 1024,
              height: 1024,
              outputCount: 1,
              label: "Dog Image Generator",
              name: "Flux Schnell"
            },
            width: 320,
            height: 404,
            selected: false
          },
          {
            id: "ajo4bc",
            type: "textInput",
            position: {
              x: 71.17485792009398,
              y: 683.0505034881503
            },
            data: {
              label: "Prompt Text",
              prompt: "A pixel art of a bowl of ramen."
            },
            width: 320,
            height: 172,
            selected: false
          },
          {
            id: "9i899t",
            type: "model",
            position: {
              x: 560.5312783422396,
              y: 679.0101896464421
            },
            data: {
              label: "Model",
              model: "black-forest-labs/flux-schnell",
              name: "Flux Schnell",
              aspectRatio: "1:1",
              outputCount: 1
            },
            width: 320,
            height: 412,
            selected: false
          },
          {
            id: "l21nia",
            type: "model",
            position: {
              x: 1199.6666475835764,
              y: 400.95171571496104
            },
            data: {
              label: "Model",
              model: "google/nano-banana",
              name: "Nano Banana",
              aspectRatio: "1:1",
              outputCount: 1
            },
            width: 320,
            height: 412,
            selected: false
          },
          {
            id: "wxqiq1",
            type: "textInput",
            position: {
              x: 556.8263571295508,
              y: -14.887301996362506
            },
            data: {
              label: "Prompt Text",
              prompt: "A japanese salaryman eating from a pixel art bowl of ramen. He is leaning over, chopsticks in hand, happily slurping up some ramen. Make sure to redraw the ramen and the salaryman so that they are properly integrated together."
            },
            width: 320,
            height: 172,
            selected: false
          }
        ],
        edges: [
          {
            id: "e1-2",
            source: "1",
            target: "2",
            sourceHandle: "prompt",
            targetHandle: "prompt",
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            data: {}
          },
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "ajo4bc",
            sourceHandle: "prompt",
            target: "9i899t",
            targetHandle: "prompt",
            id: "reactflow__edge-ajo4bcprompt-9i899tprompt"
          },
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "2",
            sourceHandle: "image",
            target: "l21nia",
            targetHandle: "image_1",
            id: "reactflow__edge-2image-l21niaimage_1"
          },
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "9i899t",
            sourceHandle: "image",
            target: "l21nia",
            targetHandle: "image_2",
            id: "reactflow__edge-9i899timage-l21niaimage_2"
          },
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "wxqiq1",
            sourceHandle: "prompt",
            target: "l21nia",
            targetHandle: "prompt",
            id: "reactflow__edge-wxqiq1prompt-l21niaprompt"
          }
        ]
      }
    }
  },

  "Video Generation": {
    "Video Generation": {
      description: "Text-to-video and image-to-video workflow",
      flow: {
        boardName: "Video Generation",
        nodes: [
          {
            id: "1",
            type: "textInput",
            position: {
              x: -138.8458625592902,
              y: 306.28965011228547
            },
            data: {
              prompt: "A realistic photo of a tomato with a human baby face. Closed eyes. Close-up, wooden table, tilt shift, narrow field of view.",
              label: "Video Description",
              name: "Prompt Text"
            },
            width: 320,
            height: 172,
            selected: false
          },
          {
            id: "0hn8dj",
            type: "model",
            position: {
              x: 253.78839287294147,
              y: 242.86948638695014
            },
            data: {
              label: "Model",
              model: "black-forest-labs/flux-schnell",
              name: "Flux Schnell",
              aspectRatio: "1:1",
              outputCount: 1
            },
            width: 320,
            height: 412,
            selected: false
          },
          {
            id: "4lirto",
            type: "textInput",
            position: {
              x: 255.85351154908636,
              y: 38.76515737589614
            },
            data: {
              label: "Prompt Text",
              prompt: "A tomato is getting slowly cut in half by a giant knife."
            },
            width: 320,
            height: 172,
            selected: false
          },
          {
            id: "yaxdrj",
            type: "model",
            position: {
              x: 708.6655666205257,
              y: 176.4873674574588
            },
            data: {
              label: "Model",
              model: "wan-video/wan-2.2-5b-fast",
              name: "WAN",
              aspectRatio: "16:9",
              outputCount: 1
            },
            width: 320,
            height: 256,
            selected: false
          }
        ],
        edges: [
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "1",
            sourceHandle: "prompt",
            target: "0hn8dj",
            targetHandle: "prompt",
            id: "reactflow__edge-1prompt-0hn8djprompt"
          },
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "4lirto",
            sourceHandle: "prompt",
            target: "yaxdrj",
            targetHandle: "prompt",
            id: "reactflow__edge-4lirtoprompt-yaxdrjprompt"
          },
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "0hn8dj",
            sourceHandle: "image",
            target: "yaxdrj",
            targetHandle: "image",
            id: "reactflow__edge-0hn8djimage-yaxdrjimage"
          }
        ]
      }
    }
  },

  "Character Creation": {
    "Character Generator": {
      description: "Generate fantasy TTRPG characters with weapons using AI models",
      flow: {
        boardName: "Character Generator",
        nodes: [
          {
            id: "b6wgg9",
            type: "textInput",
            position: {
              x: -113.31691118298455,
              y: 428.93578323917063
            },
            data: {
              label: "Weapon Prompt",
              prompt: "Write an image prompt that describes a fantasy medieval weapon for a TTRPG character. Provide only the raw prompt, and no other text. The item should be on a white background."
            },
            width: 320,
            height: 170,
            selected: false
          },
          {
            id: "lu8gqo",
            type: "model",
            position: {
              x: 284.10485899175995,
              y: 419.53952962893766
            },
            data: {
              label: "GPT-4o",
              model: "openai/gpt-4o",
              name: "GPT-4o",
              aspectRatio: "1:1",
              outputCount: 1
            },
            width: 320,
            height: 287,
            selected: false
          },
          {
            id: "ozlxl5",
            type: "model",
            position: {
              x: 672.0621798811268,
              y: 431.5763085854969
            },
            data: {
              label: "Weapon Generator",
              model: "google/nano-banana",
              name: "Nano Banana",
              aspectRatio: "1:1",
              outputCount: 1
            },
            width: 320,
            height: 412,
            selected: false
          },
          {
            id: "9hma0a",
            type: "textInput",
            position: {
              x: -111.67860805268192,
              y: 911.1265575237423
            },
            data: {
              label: "Character Prompt",
              prompt: "Generate an image prompt that will create a picture of a fantasy TTRPG character. Return only the raw prompt, and no other text. The character should be on a white background. The character should hold no items in its hands on on its person, and should be alone (with no other characters, entities, animals...)."
            },
            width: 320,
            height: 170,
            selected: false
          },
          {
            id: "e4v7e5",
            type: "model",
            position: {
              x: 275.4556124842153,
              y: 907.3396126732307
            },
            data: {
              label: "GPT-4o",
              model: "openai/gpt-4o",
              name: "GPT-4o",
              aspectRatio: "1:1",
              outputCount: 1
            },
            width: 320,
            height: 287,
            selected: false
          },
          {
            id: "blea5b",
            type: "model",
            position: {
              x: 670.4374364111688,
              y: 902.5240234784522
            },
            data: {
              label: "Character Generator",
              model: "google/nano-banana",
              name: "Nano Banana",
              aspectRatio: "1:1",
              outputCount: 1
            },
            width: 320,
            height: 412,
            selected: false
          },
          {
            id: "gy4hz2",
            type: "textInput",
            position: {
              x: 1122.6435056893567,
              y: 543.3452242968717
            },
            data: {
              label: "Composition Prompt",
              prompt: "The reference medieval fantasy character poses ferociously, holding the reference weapon."
            },
            width: 320,
            height: 170,
            selected: false
          },
          {
            id: "aofhr7",
            type: "model",
            position: {
              x: 1126.067768816176,
              y: 747.8768820765093
            },
            data: {
              label: "Final Composite",
              model: "google/nano-banana",
              name: "Final Composite",
              aspectRatio: "1:1",
              outputCount: 1
            },
            width: 320,
            height: 412,
            selected: false
          }
        ],
        edges: [
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "b6wgg9",
            sourceHandle: "prompt",
            target: "lu8gqo",
            targetHandle: "prompt",
            id: "reactflow__edge-b6wgg9prompt-lu8gqoprompt"
          },
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "lu8gqo",
            sourceHandle: "text",
            target: "ozlxl5",
            targetHandle: "prompt",
            id: "reactflow__edge-lu8gqotext-ozlxl5prompt"
          },
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "9hma0a",
            sourceHandle: "prompt",
            target: "e4v7e5",
            targetHandle: "prompt",
            id: "reactflow__edge-9hma0aprompt-e4v7e5prompt"
          },
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "e4v7e5",
            sourceHandle: "text",
            target: "blea5b",
            targetHandle: "prompt",
            id: "reactflow__edge-e4v7e5text-blea5bprompt"
          },
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "gy4hz2",
            sourceHandle: "prompt",
            target: "aofhr7",
            targetHandle: "prompt",
            id: "reactflow__edge-gy4hz2prompt-aofhr7prompt"
          },
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "ozlxl5",
            sourceHandle: "image",
            target: "aofhr7",
            targetHandle: "image_1",
            id: "reactflow__edge-ozlxl5image-aofhr7image_1"
          },
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "blea5b",
            sourceHandle: "image",
            target: "aofhr7",
            targetHandle: "image_2",
            id: "reactflow__edge-blea5bimage-aofhr7image_2"
          }
        ]
      }
    }
  },

  "Interior Design": {
    "Interior Redesign": {
      description: "Transform room interiors with different styles using AI-powered image processing",
      flow: {
        boardName: "Interior Redesign",
        nodes: [
          {
            id: "ut3nmt",
            type: "imageInput",
            position: {
              x: 283.6508718844168,
              y: 257.9337661804626
            },
            data: {
              label: "Upload Room Image",
              name: "Start here: Upload picture of room"
            },
            width: 320,
            height: 172,
            selected: false
          },
          {
            id: "wn7gf6",
            type: "textInput",
            position: {
              x: 279.2928509418212,
              y: 495.1667914387896
            },
            data: {
              label: "Style 1 Prompt",
              prompt: "Transform this interior into a modern minimalist space with clean lines, neutral colors, and sleek furniture. Keep the room's basic structure but update all furnishings and decor to reflect contemporary design principles.",
              name: "Style 1"
            },
            width: 320,
            height: 170,
            selected: false
          },
          {
            id: "f0tkeg",
            type: "textInput",
            position: {
              x: 277.6684075717791,
              y: 730.1145063893012
            },
            data: {
              label: "Style 2 Prompt",
              prompt: "Redesign this room in a cozy rustic farmhouse style with warm wood tones, vintage furniture, and natural textures. Maintain the room layout while adding character through rustic elements.",
              name: "Style 2"
            },
            width: 320,
            height: 170,
            selected: false
          },
          {
            id: "ub6qf2",
            type: "textInput",
            position: {
              x: 276.04396420173885,
              y: 965.062221339813
            },
            data: {
              label: "Style 3 Prompt",
              prompt: "Transform this space into an elegant traditional room with rich colors, classic furniture, and sophisticated decor. Keep the architectural elements while upgrading to timeless, luxurious styling.",
              name: "Style 3"
            },
            width: 320,
            height: 170,
            selected: false
          },
          {
            id: "k8u7wp",
            type: "model",
            position: {
              x: 736.4779874858598,
              y: 478.77053792855715
            },
            data: {
              label: "Style 1 Generator",
              model: "google/nano-banana",
              name: "Nano Banana",
              aspectRatio: "1:1",
              outputCount: 1
            },
            width: 320,
            height: 412,
            selected: false
          },
          {
            id: "tnqgxg",
            type: "model",
            position: {
              x: 734.853544115818,
              y: 713.7182528790688
            },
            data: {
              label: "Style 2 Generator",
              model: "google/nano-banana",
              name: "Nano Banana",
              aspectRatio: "1:1",
              outputCount: 1
            },
            width: 320,
            height: 412,
            selected: false
          },
          {
            id: "875ghx",
            type: "model",
            position: {
              x: 733.2291007457758,
              y: 948.6659678295805
            },
            data: {
              label: "Style 3 Generator",
              model: "google/nano-banana",
              name: "Nano Banana",
              aspectRatio: "1:1",
              outputCount: 1
            },
            width: 320,
            height: 412,
            selected: false
          }
        ],
        edges: [
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "wn7gf6",
            sourceHandle: "prompt",
            target: "k8u7wp",
            targetHandle: "prompt",
            id: "reactflow__edge-wn7gf6prompt-k8u7wpprompt"
          },
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "f0tkeg",
            sourceHandle: "prompt",
            target: "tnqgxg",
            targetHandle: "prompt",
            id: "reactflow__edge-f0tkegprompt-tnqgxgprompt"
          },
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "ub6qf2",
            sourceHandle: "prompt",
            target: "875ghx",
            targetHandle: "prompt",
            id: "reactflow__edge-ub6qf2prompt-875ghxprompt"
          },
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "ut3nmt",
            sourceHandle: "image",
            target: "k8u7wp",
            targetHandle: "image_1",
            id: "reactflow__edge-ut3nmtimage-k8u7wpimage_1"
          },
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "ut3nmt",
            sourceHandle: "image",
            target: "tnqgxg",
            targetHandle: "image_1",
            id: "reactflow__edge-ut3nmtimage-tnqgxgimage_1"
          },
          {
            type: "custom",
            style: {
              stroke: "#4b5563",
              strokeWidth: 2
            },
            animated: false,
            deletable: true,
            data: {},
            source: "ut3nmt",
            sourceHandle: "image",
            target: "875ghx",
            targetHandle: "image_1",
            id: "reactflow__edge-ut3nmtimage-875ghximage_1"
          }
        ]
      }
    }
  }
};

export default FLOW_TEMPLATES;