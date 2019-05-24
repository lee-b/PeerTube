import * as program from 'commander'
import { join } from 'path'
import { execSync } from 'child_process'

program
  .name('watch')
  .arguments('<url>')
  .option('-g, --gui <player>', 'player type', /^(airplay|stdout|chromecast|mpv|vlc|mplayer|ascii|xbmc)$/i, 'ascii')
  .option('-i, --invert', 'invert colors (ascii player only)', true)
  .option('-r, --resolution <res>', 'video resolution', '480')
  .on('--help', function () {
    console.log('  Available Players:')
    console.log()
    console.log('    - ascii')
    console.log('    - mpv')
    console.log('    - mplayer')
    console.log('    - vlc')
    console.log('    - stdout')
    console.log('    - xbmc')
    console.log('    - airplay')
    console.log('    - chromecast')
    console.log()
    console.log('  Note: \'ascii\' is the only option not using WebTorrent and not seeding back the video.')
    console.log()
    console.log('  Examples:')
    console.log()
    console.log('    $ peertube watch -g mpv https://peertube.cpy.re/videos/watch/e8a1af4e-414a-4d58-bfe6-2146eed06d10')
    console.log('    $ peertube watch --gui stdout https://peertube.cpy.re/videos/watch/e8a1af4e-414a-4d58-bfe6-2146eed06d10')
    console.log('    $ peertube watch https://peertube.cpy.re/videos/watch/e8a1af4e-414a-4d58-bfe6-2146eed06d10')
    console.log()
  })
  .action((url, cmd) => {
    run(url, cmd)
      .catch(err => {
        console.error(err)
        process.exit(-1)
      })
  })
  .parse(process.argv)

async function run (url: string, cmd: any) {
  if (!url) {
    console.error('<url> positional argument is required.')
    process.exit(-1)
  }

  if (cmd.gui === 'ascii') {
    const peerTerminal = require('peerterminal')
    return peerTerminal([ '--link', url, '--invert', cmd.invert ])
  }

  const CMD = 'node ' + join(__dirname, 'node_modules', 'webtorrent-hybrid', 'bin', 'cmd.js')
  const args = ` --${cmd.gui} ` +
    url.replace('videos/watch', 'download/torrents') +
    `-${cmd.resolution}.torrent`

  execSync(CMD + args)
}
