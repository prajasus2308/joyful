
export interface StoryConfig {
  topic: string;
  characters: string;
  setting: string;
  tone: 'Adventurous' | 'Funny' | 'Educational' | 'Magical' | 'Bedtime';
  length: 'Paragraph' | 'Short Story' | 'Book Chapter' | 'Outline';
}

export interface GeneratedContent {
  title: string;
  text: string;
  timestamp: number;
  rating?: number; // 1-5 stars
  config?: StoryConfig; // The parameters used to generate this story
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
  aspectRatio: string;
}
