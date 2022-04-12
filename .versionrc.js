module.exports = {
    scrips: {
        postchangelog: `./scripts/normalize-headings.sh`,
    },
    bumpFiles: [
        {
            filename: `package.json`,
            type: `json`,
        },
        {
            filename: `package-lock.json`,
            type: `json`,
        },
        {
            filename: `config.xml`,
            updater: `scripts/bump-cordova-version.js`,
        },
    ],
    types: [
        {
            type: `feat`,
            section: `✨ Features`,
            hidden: false,
        },
        {
            type: `fix`,
            section: `🐛 Bug Fixes`,
            hidden: false,
        },
        {
            type: `chore`,
            section: `♻️ Chores`,
            hidden: false,
        },
        {
            type: `docs`,
            section: `📚 Docs`,
            hidden: false,
        },
        {
            type: `style`,
            section: `💎 Style`,
            hidden: false,
        },
        {
            type: `refactor`,
            section: `📦 Refactor`,
            hidden: false,
        },
        {
            type: `perf`,
            section: `🚀 Performance`,
            hidden: false,
        },
        {
            type: `test`,
            section: `🧪 Tests`,
            hidden: false,
        },
        {
            type: `ci`,
            section: `⚙️ Continuous Integrations`,
            hidden: false,
        },
        {
            type: `build`,
            section: `🔨 Build`,
            hidden: false,
        },
        {
            type: `revert`,
            section: `🗑 Reverts`,
            hidden: false,
        },
    ],
    issueUrlFormat: `https://calmisland.atlassian.net/browse/{{prefix}}{{id}}`,
    issuePrefixes: [
        `AD-`,
        `DT-`,
        `KLL-`,
        `NAT-`,
    ],
};
