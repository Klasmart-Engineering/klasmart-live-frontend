const { join } = require(`path`);
const { writeFile } = require(`fs`).promises;
const { default: players } = require(`../lib/players`);

const generateSinglePlayers = async () => {
    for (const { key, name } of players) {
        const file = `
      const { createReactPlayer } = require('./lib/ReactPlayer')
      const Player = require('./lib/players/${name}').default
      module.exports = createReactPlayer([Player])
    `;
        await writeFile(join(`.`, `${key}.js`), file);
    }
};

generateSinglePlayers();
