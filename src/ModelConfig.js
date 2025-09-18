// Consolidated model configuration for all AI models in the Flow Editor
// This single source of truth contains all model definitions, their inputs, outputs, and UI configurations

export const MODELS_CONFIG = {
  'black-forest-labs/flux-schnell': { 
    name: 'Flux Schnell', 
    description: 'Fast image generation',
    inputs: [
      { id: 'prompt', name: 'prompt', type: 'prompt', required: true }
    ],
    outputs: [
      { id: 'image', name: 'image', type: 'image' }
    ],
    color: 'blue',
    category: 'image',
    params: ['aspectRatio'],
    aspectRatios: ['1:1', '16:9', '9:16']
  },
  'google/nano-banana': { 
    name: 'Nano Banana', 
    description: 'Edit and combine multiple images',
    inputs: [
      { id: 'prompt', name: 'prompt', type: 'prompt', required: true },
      { id: 'image_1', name: 'first image', type: 'image', required: true },
      { id: 'image_2', name: 'second image', type: 'image', required: true }
    ],
    outputs: [
      { id: 'image', name: 'image', type: 'image' }
    ],
    color: 'blue',
    category: 'image',
    params: []
  },
  'wan-video/wan-2.2-5b-fast': { 
    name: 'WAN', 
    description: 'Fast video generation',
    inputs: [
      { id: 'prompt', name: 'prompt', type: 'prompt', required: true },
      { id: 'image', name: 'start frame', type: 'image', required: false }
    ],
    outputs: [
      { id: 'video', name: 'video', type: 'video' }
    ],
    color: 'purple',
    category: 'video',
    params: ['aspectRatio'],
    aspectRatios: ['16:9', '9:16']
  },
  'bytedance/seedance-1-lite': { 
    name: 'Seedance Lite', 
    description: 'Video generation with start and end frame',
    inputs: [
      { id: 'prompt', name: 'prompt', type: 'prompt', required: true },
      { id: 'image', name: 'start frame', type: 'image', required: false },
      { id: 'last_frame_image', name: 'end frame', type: 'image', required: false }
    ],
    outputs: [
      { id: 'video', name: 'video', type: 'video' }
    ],
    color: 'purple',
    category: 'video',
    params: ['aspectRatio'],
    aspectRatios: ['1:1', '16:9', '9:16']
  },
  'bytedance/seedance-1-pro': { 
    name: 'Seedance Pro', 
    description: 'Premium video generation',
    inputs: [
      { id: 'prompt', name: 'prompt', type: 'prompt', required: true },
      { id: 'image', name: 'start frame', type: 'image', required: false }
    ],
    outputs: [
      { id: 'video', name: 'video', type: 'video' }
    ],
    color: 'purple',
    category: 'video',
    params: ['aspectRatio'],
    aspectRatios: ['1:1', '16:9', '9:16']
  },
  'openai/gpt-4o': {
    name: 'GPT-4o',
    description: 'Language model',
    inputs: [
      { id: 'prompt', name: 'prompt', type: 'prompt', required: true },
      { id: 'image', name: 'image', type: 'image', required: false }
    ],
    outputs: [
      { id: 'text', name: 'text', type: 'text' }
    ],
    color: 'blue',
    category: 'language',
    params: ['system_prompt', 'outputs']
  },
  'openai/gpt-5': {
    name: 'GPT-5',
    description: 'Language model',
    inputs: [
      { id: 'prompt', name: 'prompt', type: 'prompt', required: true },
      { id: 'image', name: 'image', type: 'image', required: false }
    ],
    outputs: [
      { id: 'text', name: 'text', type: 'text' }
    ],
    color: 'blue',
    category: 'language',
    params: ['system_prompt', 'outputs']
  },
  'minimax/speech-02-turbo': {
    name: 'MiniMax Speech-02',
    description: 'Speech generation',
    inputs: [
      { id: 'text', name: 'text', type: 'text', required: true }
    ],
    outputs: [
      { id: 'audio', name: 'audio', type: 'audio' }
    ],
    color: 'green',
    category: 'voice',
    params: ['voice_id'],
    voiceOptions: [
      'English_Trustworth_Man',
      'English_Aussie_Bloke',
      'English_CalmWoman',
      'English_UpsetGirl',
      'English_Gentle-voiced_man',
      'English_Whispering_girl',
      'English_Diligent_Man',
      'English_Graceful_Lady',
      'English_ReservedYoungMan',
      'English_PlayfulGirl',
      'English_ManWithDeepVoice',
      'English_MaturePartner',
      'English_FriendlyPerson',
      'English_MatureBoss',
      'English_Debator',
      'English_LovelyGirl',
      'English_Steadymentor',
      'English_Deep-VoicedGentleman',
      'English_Wiselady',
      'English_CaptivatingStoryteller',
      'English_DecentYoungMan',
      'English_SentimentalLady',
      'English_ImposingManner',
      'English_SadTeen',
      'English_PassionateWarrior',
      'English_WiseScholar',
      'English_Soft-spokenGirl',
      'English_SereneWoman',
      'English_ConfidentWoman',
      'English_PatientMan',
      'English_Comedian',
      'English_BossyLeader',
      'English_Strong-WilledBoy',
      'English_StressedLady',
      'English_AssertiveQueen',
      'English_AnimeCharacter',
      'English_Jovialman',
      'English_WhimsicalGirl',
      'English_Kind-heartedGirl'
    ]
  },
  'sync/lipsync-2': {
    name: 'Lipsync-2',
    description: 'Lipsync video with audio',
    inputs: [
      { id: 'video', name: 'video', type: 'video', required: true },
      { id: 'audio', name: 'audio', type: 'audio', required: true }
    ],
    outputs: [
      { id: 'video', name: 'video', type: 'video' }
    ],
    color: 'purple',
    category: 'video',
    params: ['sync_mode'],
    syncModeOptions: ['bounce', 'loop']
  }
};

// Helper functions to get models by category
export const getImageModels = () => {
  return Object.entries(MODELS_CONFIG)
    .filter(([_, config]) => config.category === 'image')
    .reduce((acc, [key, config]) => ({ ...acc, [key]: config }), {});
};

export const getVideoModels = () => {
  return Object.entries(MODELS_CONFIG)
    .filter(([_, config]) => config.category === 'video')
    .reduce((acc, [key, config]) => ({ ...acc, [key]: config }), {});
};

export const getLanguageModels = () => {
  return Object.entries(MODELS_CONFIG)
    .filter(([_, config]) => config.category === 'language')
    .reduce((acc, [key, config]) => ({ ...acc, [key]: config }), {});
};

export const getVoiceModels = () => {
  return Object.entries(MODELS_CONFIG)
    .filter(([_, config]) => config.category === 'voice')
    .reduce((acc, [key, config]) => ({ ...acc, [key]: config }), {});
};

export default MODELS_CONFIG;