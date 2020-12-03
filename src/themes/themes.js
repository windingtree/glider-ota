import React,{useState, useRef} from 'react'
import style from './themes.module.scss'
import { Button } from 'react-bootstrap';
import defaultTheme from './default.json'
import darkTheme from './dark.json'
const themes = [defaultTheme,darkTheme];

const ThemeSwitcher = (children) =>{
    const ref = useRef(null);
    const [currentTheme, setCurrentTheme] = useState(0)

    const onClick = () =>{
        console.log('OnClick')
        ref.current.style.setProperty('--theme-color','pink');
        changeTheme();
    }

    const changeTheme = () => {
        let newTheme;
        if(currentTheme==0)
            newTheme=1;
        else
            newTheme=0;

        let theme = themes[newTheme];
        console.log('New theme idx:',newTheme, 'Props:',theme)
        for(let property in theme){
            // console.log(`Property ${property} before change:${ref.current.style.getProperty(property)}`)
            ref.current.style.setProperty(property,theme[property]);
        }

        setCurrentTheme(newTheme)
    }
    console.log('Themes:',themes)
    return (
        <>
            <Button onClick={onClick} >Click me</Button>
            <div className={style.themeSwitch}>TEST</div>
            <div ref={ref}>{children}</div>
        </>
    )
}


export const ThemeTest = () =>{
    return (
        <>
            <div className={style.testThemes}>ThemeTestComponent</div>
        </>
    )
}
export default ThemeSwitcher
