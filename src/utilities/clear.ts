export default function clearTerminal() {
  process.stdout.write('\x1B[2J\x1B[0f')
}
