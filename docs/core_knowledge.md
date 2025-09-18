# Core Knowledge
This document covers the core knowledge for creating generative workflows.

## Node Types
These are the only nodes available in our system. Do not invent new ones and instead creatively link together only the available nodes.

- **textInput**: For text prompts and instructions
- **imageInput**: For image uploads and references  
- **model**: AI model execution nodes

## Available Models
These are the models that are available for use in our system. Do not invent any new models and make do with what is here. If a user requests an unavailable model, inform them it doesn't exist and offer an alternative from this list.

### Image Models
- `black-forest-labs/flux-schnell` — Input: prompt (required). Output: image. Params: aspectRatio (one of: 1:1, 16:9, 9:16)
- `google/nano-banana` — Input: prompt (required), image_1 (required), image_2 (required). Output: image. Params: none

### Video Models
Note: For video models, the optional image input named image is the starting frame. Where supported, last_frame_image sets the ending frame (Seedance Lite only).
- `wan-video/wan-2.2-5b-fast` — Input: prompt (required), image (optional). Output: video. Params: aspectRatio (one of: 16:9, 9:16)
- `bytedance/seedance-1-lite` — Input: prompt (required), image (optional), last_frame_image (optional). Output: video. Params: aspectRatio (one of: 1:1, 16:9, 9:16)
- `bytedance/seedance-1-pro` — Input: prompt (required), image (optional). Output: video. Params: aspectRatio (one of: 1:1, 16:9, 9:16)

### Language Models
- `openai/gpt-4o` — Input: prompt (required), image (optional). Output: text. Params: system_prompt, outputs
- `openai/gpt-5` — Input: prompt (required), image (optional). Output: text. Params: system_prompt, outputs

### Voice Models
- `minimax/speech-02-turbo` — Input: text (required). Output: audio. Params: voice_id
  - voice_id options: English_Trustworth_Man, English_Aussie_Bloke, English_CalmWoman, English_UpsetGirl, English_Gentle-voiced_man, English_Whispering_girl, English_Diligent_Man, English_Graceful_Lady, English_ReservedYoungMan, English_PlayfulGirl, English_ManWithDeepVoice, English_MaturePartner, English_FriendlyPerson, English_MatureBoss, English_Debator, English_LovelyGirl, English_Steadymentor, English_Deep-VoicedGentleman, English_Wiselady, English_CaptivatingStoryteller, English_DecentYoungMan, English_SentimentalLady, English_ImposingManner, English_SadTeen, English_PassionateWarrior, English_WiseScholar, English_Soft-spokenGirl, English_SereneWoman, English_ConfidentWoman, English_PatientMan, English_Comedian, English_BossyLeader, English_Strong-WilledBoy, English_StressedLady, English_AssertiveQueen, English_AnimeCharacter, English_Jovialman, English_WhimsicalGirl, English_Kind-heartedGirl

### Lipsync Models
- `sync/lipsync-2` — Input: video (required), audio (required). Output: video. Params: none

## Handle Types
The new explicit handle system ensures that handle names and IDs are identical for clarity:

### Input/Output Handles:
- Text handles: `prompt`, `text`
- Image handles: `image`, `input_image`, `image_1`, `image_2`, `last_frame_image`
- Video handles: `video`
- Audio handles: `audio`

### Model-Specific Handle Examples:

**Flux Schnell/Dev**: 
- Inputs: `prompt`
- Outputs: `image`

**Flux Kontext**: 
- Inputs: `prompt`, `input_image`
- Outputs: `image`

**Google Nano Banana**: 
- Inputs: `prompt`, `image_1`, `image_2`
- Outputs: `image`

**WAN Video/Seedance**: 
- Inputs: `prompt`, `input_image`
- Outputs: `video`

**OpenAI Language Models (GPT-4o, GPT-4o Mini)**:
- Inputs: `prompt`, `image` (optional)
- Outputs: `text`

**OpenAI Reasoning Models (o1-preview, o1-mini)**:
- Inputs: `prompt`
- Outputs: `text`

**Anthropic Language Models (Claude 3.5 Sonnet, Claude 3 Haiku)**:
- Inputs: `prompt`, `image` (optional)  
- Outputs: `text`

*Note: Handle names and IDs are now explicitly defined in `modelConfig.js` for each model, making connections more predictable and easier to understand. Text outputs can connect to prompt inputs, enabling language model chaining.*
