export enum PathType {
  LINEAR = 'LINEAR',
  TANGENT = 'TANGENT'
}

export interface ConceptNode {
  id: string;
  title: string;
  description: string;
  type: PathType;
  depth: number; // 0 is the root topic
}

export interface ExplorationResult {
  rootTopic: string;
  linearPath: ConceptNode[];
  tangentPath: ConceptNode[];
  divergenceScore: number; // 0 to 100, how far the tangent went
}

export interface AnalysisRequest {
  topic: string;
}
