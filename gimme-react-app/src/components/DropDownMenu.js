import { useState, useRef } from 'react';
import { useOnClickOutside } from '../tools/CustomHooks';
import Button from './Button';

import classes from './DropDownMenu.module.scss';

function DropDownMenu(props) {
  const [display, setDisplay] = useState(props.display)
  const [showOptions, setShowOptions] = useState(false)
  const options = props.options.slice();
  options.unshift('default')
  const menuRef = useRef(null);
  const style = stylize();

  useOnClickOutside(menuRef, ()=>{
    closeMenu()
    setDisplay(props.display)
  })

  function stylize() {
    return {
      mode: getMode(),
      textStyle: getTextStyle(),
      justify: getJustify(),
    }
  }

  function getMode() {
    if(props.style && props.style.mode) {
      const { mode } = props.style;
      if(mode === 'light') return 'light'
      if(mode === 'dark') return 'dark'
    }
    else return 'dark'
  }

  function getJustify() {
    if(props.style && props.style.justify) {
      const { justify } = props.style;
      if(justify === 'right') return `${classes.right}`
      else return `${classes.left}`
    }
    else return ''
  }

  function getTextStyle() {
    if(props.style && props.style.textStyle) {
      const { textStyle } = props.style;
      if(textStyle === 'lowercase') return `${classes.option__lowercase}`
      if(textStyle === 'uppercase') return `${classes.option__uppercase}`
      if(textStyle === 'capitalize') return `${classes.option__capitalize}`
    }
    else return ''
  }

  function openMenu() {
    setDisplay(props.display)
    setShowOptions(true)
  }

  function closeMenu() {
    setShowOptions(false)
  }

  async function handleSelectOption(option) {
    const result = await props.onSelect(option)
    console.log(result)
    if(!result.error) {
      closeMenu()
      setDisplay('changed!')
    }
  }

  return (
    <div ref={menuRef} className={classes.DropDownMenu} type={style.mode}>
      <Button onClick={openMenu}>{display}</Button>

      { showOptions && <div className={`${classes.options} ${style.justify}`}>
          { options.map((option) => {
              return <div
                key={option}
                className={`${classes.option} ${style.textStyle}`}
                onClick={() => handleSelectOption(option)}>
                {option}
                {props.selected === option && <div className={classes.selectedIcon}>
                  <div className={classes.icon}></div>
                </div>}
              </div>
            })
          }
        </div>
      }

    </div>
  );
}

export default DropDownMenu;
