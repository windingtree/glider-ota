require('dotenv').config();  //load .env
const path = require('path');
const fs = require('fs').promises;

const DEFAULT_THEME_NAME = 'default'
const BASE_THEMES_FOLDER = 'themes'
const DESTINATION_CSS_FOLDER = 'src/styles'


console.log('Theme to be prepared:', process.env.THEME)

const getThemeFolder = (theme) => {
    return path.join(process.cwd(), BASE_THEMES_FOLDER, theme);
}

const ensureThemeExist = async (theme) => {
    const themeFolder = getThemeFolder(theme);
    console.log(themeFolder)
    try {
        await fs.access(themeFolder);
    } catch (err) {
        throw new Error(`Theme ${theme} does not exist - folder ${themeFolder} was not found or is not accessible`);
    }
}

const copyCSSDefinition = async (theme) => {
    const sourceCssPath = path.join(getThemeFolder(theme), 'theme.scss');
    const destinationCssPath = path.join(process.cwd(), DESTINATION_CSS_FOLDER, 'theme.scss');
    await fs.copyFile(sourceCssPath, destinationCssPath);
}

(async () => {

    let theme = process.env.THEME;
    if (!theme)
        theme = DEFAULT_THEME_NAME;
    console.log(`Preparing theme: ${theme}`)
    await ensureThemeExist(theme)
    await copyCSSDefinition(theme);
})()
