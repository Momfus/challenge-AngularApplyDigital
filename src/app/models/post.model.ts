interface HighlightResult {
  value: string;
  matchLevel: string;
  matchedWords: string[];
}

export interface Hit {
  created_at: Date;
  title: string;
  url: string;
  author: string;
  points: number;
  story_text: string | null;
  comment_text: string | null;
  num_comments: number;
  story_id: number | null;
  story_title: string | null;
  story_url: string | null;
  parent_id: number | null;
  created_at_i: Date;
  relevancy_score: number;
  _tags: string[];
  objectID: string;
  _highlightResult: {
    title: HighlightResult;
    url: HighlightResult;
    author: HighlightResult;
  };
  like: boolean;
}

