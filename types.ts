
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
}
