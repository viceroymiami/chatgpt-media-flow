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
            height: 229,
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
            height: 149,
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
              x: 1057.959356201619,
              y: 525.6940496779516
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
              x: 1055.7956929815136,
              y: 268.52728076755216
            },
            data: {
              label: "Prompt Text",
              prompt: "A japanese salaryman eating from a pixel art bowl of ramen. He is leaning over, chopsticks in hand, happily slurping up some ramen. Make sure to redraw the ramen and the salaryman so that they are properly integrated together."
            },
            width: 320,
            height: 229,
            selected: false
          },
          {
            id: "zoq7yg",
            type: "organizationBox",
            position: {
              x: 530.2370200284822,
              y: 75.69979714629744
            },
            data: {
              label: "Initial images generator",
              description: ""
            },
            style: {
              width: 382,
              height: 1057
            },
            width: 382,
            height: 1057,
            selected: false
          },
          {
            id: "5m8jpi",
            type: "organizationBox",
            position: {
              x: 1027.5367959931584,
              y: 158.51903522580358
            },
            data: {
              label: "Final composition",
              description: ""
            },
            style: {
              width: 380,
              height: 818
            },
            width: 380,
            height: 818,
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
            id: "reactflow__edge-2image-l21niaimage_1",
            selected: false
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
            id: "reactflow__edge-9i899timage-l21niaimage_2",
            selected: false
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
            id: "reactflow__edge-wxqiq1prompt-l21niaprompt",
            selected: false
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
        name: "Character Generator",
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
            height: 412,
            selected: false
          },
          {
            id: "ozlxl5",
            type: "model",
            position: {
              x: 673.0981361789159,
              y: 419.1448330120277
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
              x: -114.78647694604925,
              y: 934.9535523728917
            },
            data: {
              label: "Character Prompt",
              prompt: "Generate an image prompt that will create a picture of a fantasy TTRPG character. Return only the raw prompt, and no other text. The character should be on a white background. Specify that the character should hold no items in its hands or on on its person, and should be alone (with no other characters, entities, animals...)."
            },
            width: 320,
            height: 170,
            selected: false
          },
          {
            id: "e4v7e5",
            type: "model",
            position: {
              x: 279.59943767537175,
              y: 930.1306512245909
            },
            data: {
              label: "GPT-4o",
              model: "openai/gpt-4o",
              name: "GPT-4o",
              aspectRatio: "1:1",
              outputCount: 1
            },
            width: 320,
            height: 412,
            selected: false
          },
          {
            id: "blea5b",
            type: "model",
            position: {
              x: 672.5093490067471,
              y: 928.4229309231798
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
          },
          {
            id: "ki5lq6",
            type: "organizationBox",
            position: {
              x: -131.0035887022715,
              y: 340.52395932401964
            },
            data: {
              label: "Weapon Generation",
              description: "GPT-4o comes up with an image prompt for Nano-Banana."
            },
            style: {
              width: 1160,
              height: 499
            },
            width: 1160,
            height: 499,
            selected: false
          },
          {
            id: "xhs20t",
            type: "organizationBox",
            position: {
              x: -131.0434515576719,
              y: 852.865652715009
            },
            data: {
              label: "Character Generation",
              description: "GPT-4o comes up with an image prompt for Nano-Banana."
            },
            style: {
              width: 1161,
              height: 492
            },
            width: 1161,
            height: 492,
            selected: false
          },
          {
            id: "d89ff2",
            type: "organizationBox",
            position: {
              x: 1078.477093574501,
              y: 460.30354410618577
            },
            data: {
              label: "Final Composition",
              description: "",
              backgroundColor: "#374151"
            },
            style: {
              width: 413,
              height: 739
            },
            width: 413,
            height: 739,
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
        name: "Interior Redesign",
        nodes: [
          {
            id: "ut3nmt",
            type: "imageInput",
            position: {
              x: 287.1952932155933,
              y: 282.74471549869844
            },
            data: {
              label: "Upload Image",
              uploadedImage: null,
              name: "Start here: Upload picture of room",
              status: "complete"
            },
            width: 320,
            height: 222,
            selected: false
          },
          {
            id: "aepzzi",
            type: "textInput",
            position: {
              x: 289.0739227882707,
              y: 559.7522349966075
            },
            data: {
              label: "Prompt Text",
              prompt: "Modern Minimalism",
              name: "Style 1",
              status: "complete"
            },
            width: 320,
            height: 149,
            selected: false
          },
          {
            id: "jdtf6t",
            type: "textInput",
            position: {
              x: 288.7786023385698,
              y: 771.4666295698717
            },
            data: {
              label: "Prompt Text",
              prompt: "Mid-century Modern",
              name: "Style 2",
              status: "complete"
            },
            width: 320,
            height: 149,
            selected: false
          },
          {
            id: "ub6qf2",
            type: "textInput",
            position: {
              x: 289.89816887591024,
              y: 988.966661211843
            },
            data: {
              label: "Prompt Text",
              prompt: "Medieval",
              name: "Style 3",
              status: "complete"
            },
            width: 320,
            height: 149,
            selected: false
          },
          {
            id: "ximqa0",
            type: "model",
            position: {
              x: 713.1595113296663,
              y: 123.88405002415129
            },
            data: {
              label: "Model",
              model: "openai/gpt-4o",
              name: "GPT-4o",
              aspectRatio: "1:1",
              outputCount: 1,
              systemPrompt: "Task: Generate image prompt that will be used to transform the reference image into the provided style.\nThe prompt should refer to the reference image as \"reference image\".\nName some features from the reference image, and the way that they should be revised. State that the room proportions and perspective should not change.\nImportant: Only return the raw prompt and no other text.",
              status: "complete"
            },
            width: 320,
            height: 412,
            selected: false
          },
          {
            id: "g51wpc",
            type: "model",
            position: {
              x: 716.671970189814,
              y: 1015.4605068229052
            },
            data: {
              label: "Model",
              model: "openai/gpt-4o",
              name: "GPT-4o",
              aspectRatio: "1:1",
              outputCount: 1,
              systemPrompt: "Task: Generate image prompt that will be used to transform the reference image into the provided style.\nThe prompt should refer to the reference image as \"reference image\".\nName some features from the reference image, and the way that they should be revised. State that the room proportions and perspective should not change.\nImportant: Only return the raw prompt and no other text.",
              status: "complete"
            },
            width: 320,
            height: 412,
            selected: false
          },
          {
            id: "93o0h8",
            type: "model",
            position: {
              x: 717.6172424086755,
              y: 566.4930877180835
            },
            data: {
              label: "Model",
              model: "openai/gpt-4o",
              name: "GPT-4o",
              aspectRatio: "1:1",
              outputCount: 1,
              systemPrompt: "Task: Generate image prompt that will be used to transform the reference image into the provided style.\nThe prompt should refer to the reference image as \"reference image\".\nName some features from the reference image, and the way that they should be revised. State that the room proportions and perspective should not change.\nImportant: Only return the raw prompt and no other text.",
              status: "complete"
            },
            width: 320,
            height: 412,
            selected: false
          },
          {
            id: "k8u7wp",
            type: "model",
            position: {
              x: 1127.553475360898,
              y: 120.3824754999298
            },
            data: {
              label: "Model",
              model: "google/nano-banana",
              name: "Nano Banana",
              aspectRatio: "1:1",
              outputCount: 1,
              status: "complete"
            },
            width: 320,
            height: 412,
            selected: false
          },
          {
            id: "875ghx",
            type: "model",
            position: {
              x: 1131.632107355748,
              y: 1017.6702338951422
            },
            data: {
              label: "Model",
              model: "google/nano-banana",
              name: "Nano Banana",
              aspectRatio: "1:1",
              outputCount: 1,
              status: "complete"
            },
            width: 320,
            height: 412,
            selected: false
          },
          {
            id: "tnqgxg",
            type: "model",
            position: {
              x: 1128.749964124049,
              y: 564.7583486879344
            },
            data: {
              label: "Model",
              model: "google/nano-banana",
              name: "Nano Banana",
              aspectRatio: "1:1",
              outputCount: 1,
              status: "complete"
            },
            width: 320,
            height: 412,
            selected: false
          },
          {
            id: "1ffxn2",
            type: "organizationBox",
            position: {
              x: 689.1281694098658,
              y: 6.552278844960483
            },
            data: {
              label: "Makeover prompt generator",
              description: ""
            },
            style: {
              width: 371,
              height: 1451
            },
            width: 371,
            height: 1451,
            selected: false
          },
          {
            id: "inotbm",
            type: "organizationBox",
            position: {
              x: 262.579666282258,
              y: 178.51552626589012
            },
            data: {
              label: "Start here",
              description: "Upload room image and set styles"
            },
            style: {
              width: 380,
              height: 985
            },
            width: 380,
            height: 985,
            selected: false
          },
          {
            id: "ixadld",
            type: "organizationBox",
            position: {
              x: 1102.0402402533093,
              y: 6.391376229290927
            },
            data: {
              label: "Final redesign images",
              description: ""
            },
            style: {
              width: 377,
              height: 1448
            },
            width: 377,
            height: 1448,
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
            source: "ximqa0",
            sourceHandle: "text",
            target: "k8u7wp",
            targetHandle: "prompt",
            id: "reactflow__edge-ximqa0text-k8u7wpprompt",
            selected: false
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
            source: "93o0h8",
            sourceHandle: "text",
            target: "tnqgxg",
            targetHandle: "prompt",
            id: "reactflow__edge-93o0h8text-tnqgxgprompt",
            selected: false
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
            source: "g51wpc",
            sourceHandle: "text",
            target: "875ghx",
            targetHandle: "prompt",
            id: "reactflow__edge-g51wpctext-875ghxprompt",
            selected: false
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
            source: "aepzzi",
            sourceHandle: "prompt",
            target: "ximqa0",
            targetHandle: "prompt",
            id: "reactflow__edge-aepzziprompt-ximqa0prompt",
            selected: false
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
            source: "jdtf6t",
            sourceHandle: "prompt",
            target: "93o0h8",
            targetHandle: "prompt",
            id: "reactflow__edge-jdtf6tprompt-93o0h8prompt",
            selected: false
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
            target: "g51wpc",
            targetHandle: "prompt",
            id: "reactflow__edge-ub6qf2prompt-g51wpcprompt",
            selected: false
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
            target: "ximqa0",
            targetHandle: "image",
            id: "reactflow__edge-ut3nmtimage-ximqa0image",
            selected: false
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