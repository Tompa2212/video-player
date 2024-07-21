import { useEffect, useState } from 'react';
import { formatSrt } from '../utils';
import { Subtitle } from './video-player';

async function fetchSubtitles(subtitlesUrl?: string) {
  if (!subtitlesUrl) {
    return [];
  }

  try {
    const response = await fetch(subtitlesUrl);

    if (!response.ok) {
      return [];
    }

    const data = await response.text();

    return formatSrt(data);
  } catch (error) {
    return [];
  }
}

export function useSubtitles(subtitlesUrl?: string) {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);

  useEffect(() => {
    fetchSubtitles(subtitlesUrl).then((subtitles) => {
      setSubtitles(subtitles);
    });
  }, [subtitlesUrl]);

  return subtitles;
}
