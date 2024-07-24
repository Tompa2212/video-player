function splitTextFirstOrSecondOccurrence(text: string): string[] {
  const firstOccurrence = text.indexOf('\r\n');
  if (firstOccurrence === -1) {
    return [text];
  }

  const secondOccurrence = text.indexOf('\r\n', firstOccurrence + 2);
  if (secondOccurrence === -1) {
    return [
      text.substring(0, firstOccurrence),
      text.substring(firstOccurrence + 2)
    ];
  }

  const split1 = text.substring(0, firstOccurrence);
  const split2 = text.substring(firstOccurrence + 2, secondOccurrence);
  const remainingText = text.substring(secondOccurrence + 2);

  return [split1, split2, remainingText];
}

function parseSrtTimestamp(time: string) {
  const [startMs, endMs] = time.split('-->').map((t) => t.trim());

  return [timeToMs(startMs), timeToMs(endMs)];
}

function timeToMs(time: string) {
  const [h, m] = time.split(':').map(Number);

  const s = Number(time.split(':')[2].replace(',', '.'));

  return h * 3600 + m * 60 + s;
}

export function formatSrt(srt: string) {
  const subtitleItems = srt.split('\r\n\r\n');

  return subtitleItems.map((item) => {
    const [sequence, time, text] = splitTextFirstOrSecondOccurrence(item);
    const [start, end] = parseSrtTimestamp(time);

    return { sequence: Number(sequence), start, end, text };
  });
}

function append0IfSingleDigit(n: number) {
  return n < 10 ? `0${n}` : n;
}

export function secondsToFormatedTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const timeArr = [minutes, remainingSeconds];

  if (hours) {
    timeArr.unshift(hours);
  }

  return timeArr.map(append0IfSingleDigit).join(':');
}
