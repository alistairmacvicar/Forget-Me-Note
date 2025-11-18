import { pipeline } from '@xenova/transformers';

const getExtractor = () => {
  return pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
};

export const embedText = async (text: string) => {
  const extractor = await getExtractor();

  const response = await extractor([text], {
    pooling: 'mean',
    normalize: true,
  });

  const embedding = Array.from(response.data);

  return embedding;
};
