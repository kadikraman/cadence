import { readFile, writeFile } from 'node:fs/promises';

const [feedbackFile, bodyFile] = process.argv.slice(2);
const result = JSON.parse(await readFile(feedbackFile, 'utf8'));
const report = result.feedback ?? result.crash ?? result;
const comment = (report.comment ?? '').trim();
const screenshots = (report.screenshots ?? [])
  .map(screenshot => screenshot.url)
  .filter(Boolean);

const lines = [
  '> [!NOTE]',
  '> Filed from TestFlight feedback. Bug triage reproduces it on an iOS Simulator and posts the result below.',
  '',
  '### What the tester wrote',
  '',
  comment
    ? comment
        .split('\n')
        .map(line => `> ${line}`)
        .join('\n')
    : '> The tester did not write a comment.',
];

if (screenshots.length > 0) {
  lines.push(
    '',
    '### Screenshots',
    '',
    screenshots
      .map(
        (url, index) =>
          `<a href="${url}"><img src="${url}" width="300" alt="Screenshot ${index + 1} from the tester"></a>`
      )
      .join(' '),
    '',
    '<sub>TestFlight screenshot links expire.</sub>'
  );
}

lines.push(
  '',
  '| Build | Device | iOS |',
  '| --- | --- | --- |',
  `| ${report.buildVersion ?? 'unknown'} | ${report.deviceModel ?? 'unknown'} | ${report.osVersion ?? 'unknown'} |`
);

if (result.logText) {
  const codeFence = '`'.repeat(3);
  lines.push(
    '',
    '<details>',
    '<summary>Crash log</summary>',
    '',
    codeFence,
    result.logText.slice(0, 20000),
    codeFence,
    '',
    '</details>'
  );
}

await writeFile(bodyFile, `${lines.join('\n')}\n`);

const title =
  comment.split('\n')[0] ||
  (result.crash ? 'TestFlight crash report' : 'TestFlight feedback');
console.log(title.slice(0, 100));
