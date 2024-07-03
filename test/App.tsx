import React, { useCallback, useEffect, useRef, useState } from 'react'


interface IUseValidator {
  mainElement: HTMLElement,
  delay?: number,
  isValidate: boolean,
  onChange: (element: HTMLElement, value: string) => void;
}


const useValidator = ({ mainElement, delay = 1000, isValidate, onChange }: IUseValidator) => {

  const datesStartsWithYearPoints = [
    'yyyy.mm.dd',
    'yyyy.dd.mm'
  ]

  const datesStartsWithYearDash = [
    'yyyy-mm-dd',
    'yyyy-m-d'
  ]

  const datesStartsWithYearSlash = [
    'yyyy/mm/dd',
    'yyyy/m/d'
  ]

  const datesStartsWithDayPoints = [
    'd.m.yyyy',
  ]

  const datesStartsWithDayDash = [
    'd-m-yyyy',
    'dd-mm-yyyy'
  ]

  const datesStartsWithDaySlash = [
    'd/m/yyyy',
    'dd/mm/yyyy',
    'dd/mm/yyyy',
  ]

  const datesStartsWithMonthSlash = [
    'm/d/yyyy',
  ]

  const demiliers = ['.', '-', '/'];

  const findInputs = (parent: HTMLElement | ChildNode) => {

    let result: HTMLInputElement[] = [];

    const recursiveFind = (parentElement: HTMLElement | ChildNode) => {

      if (parentElement.childNodes.length > 0) {
        parentElement.childNodes.forEach((childNode) => {
          const elementChildNode = childNode as HTMLElement;
          if (
            childNode.nodeName === "INPUT"
            &&
            elementChildNode.dataset.validate === '1'
            &&
            elementChildNode.dataset.validatevalue
            &&
            elementChildNode.dataset.typevalidate
          ) {
            result.push(childNode as HTMLInputElement);
          }
          if (childNode.childNodes.length > 0) {
            recursiveFind(childNode);
          }
        })
      }

    }

    if (parent) {
      recursiveFind(parent);
    }

    return result;
  }

  const dateValidator = (element: HTMLInputElement) => {

    let elementDate = new Date(element.value);

    const regular = element.dataset.validatevalue!;
    if(elementDate.toString() === 'Invalid Date') {

      const elementDemilier = demiliers.find((demilier) => {
        if(element.value.indexOf(demilier) !== -1) {
          return demilier;
        }
      })
      if(elementDemilier) {
        const elementValueSplitted = element.value.split(elementDemilier); 
        
        if(
          elementValueSplitted.length === 3 
          && 
          elementValueSplitted[0].length <= 2 
          && 
          elementValueSplitted[1].length <= 2
        ) {
          elementDate = new Date(Number(elementValueSplitted[2]), Number(elementValueSplitted[1]) - 1, Number(elementValueSplitted[0]))
        }
        
      }

    }
    console.log(elementDate, element, element.value, new Date(element.value));
    if (elementDate && elementDate.toString() !== 'Invalid Date') {
      const regularDemilier = demiliers.find((demilier) => {
        if (regular.indexOf(demilier) !== -1) {
          return demilier;
        }
      })

      if (regularDemilier) {
        const regularSplitted = regular.split(regularDemilier);

        let endValue = "";

        for (let i = 0; i < regularSplitted.length; i++) {
          const isLastIndex = i === regularSplitted.length - 1;

          if (regularSplitted[i].indexOf("y") !== -1) {
            endValue += `${elementDate.getFullYear()}`
          } else if (regularSplitted[i].indexOf("d") !== -1) {
            if (regularSplitted[i].length === 2) {
              endValue += `${addZero(elementDate.getDate().toString())}`;
            } else {
              endValue += `${removeZero(elementDate.getDate().toString())}`;
            }
          } else if (regularSplitted[i].indexOf("m") !== -1) {
            if (regularSplitted[i].length === 2) {
              endValue += `${addZero(String(elementDate.getMonth() + 1))}`
            } else {
              endValue += `${addZero(String(elementDate.getMonth() + 1))}`;
            }
          }

          if (!isLastIndex) {
            endValue += `${regularDemilier}`;
          }

        }
        element.value = endValue;
        onChange(element, endValue);
      } else {
        element.value = "";
        onChange(element, "");
      }
    } else {
      element.value = "";
      onChange(element, "");
    }

  }

  const removeZero = (value: string) => {
    return value.slice(1);
  }

  const addZero = (value: string) => {
    return value.padStart(2, '0');
  }

  useEffect(() => {

    let interval: NodeJS.Timeout;
    if (mainElement && isValidate) {
      const allInputElement = findInputs(mainElement);
      interval = setInterval(() => {

        allInputElement.forEach((inputElement) => {
          dateValidator(inputElement);
        })

        clearInterval(interval);
      }, delay)
    } else {
      clearInterval(interval!);
    }

    return () => {
      clearInterval(interval);
    }
  }, [mainElement, isValidate])

}

/**
 * @param `placeholder` - сама маска для инпута
 * @param `dataSlots?` - показывает где будут находиться символы. Пример: при placeholder +1 (___) ___-____ , dataSlots будет _
 * @param `dataAccept?` - регулярки, по стандарту \\d, g
 * @param `value?` - получение значения инпута 
 * @param `styleForInput` - стиль для инпута
 * @param `classNameForInput` - className для инпута
 * 
 * @author `Vladimir aka Jad`
 * 
 * @returns component of InputMask
 */

interface mainProps {
  placeholder: string,
  dataSlots: string,
  dataAccept?: string,
  value?: Function,
  styleForInput?: React.HTMLAttributes<HTMLInputElement> | React.CSSProperties,
  classNameForInput?: string,
  funcKeyDown?: Function,
  onBlur?: Function,
  defaultValue?: string,
  onClick?: boolean,
  nameInput?: string,
}
//избавить от типа any 
const InputMask: React.FC<mainProps> = ({ placeholder, dataSlots, dataAccept, value, styleForInput, classNameForInput, funcKeyDown, onBlur, defaultValue, onClick = false, nameInput }) => {

  const inputRef: React.MutableRefObject<HTMLInputElement | null | any> = useRef(null)

  const [selection, setSelection] = useState<number | undefined | null | any>(null)

  useEffect(() => {
    if (!selection) return
    const { start, end }: any = selection
    inputRef.current?.focus()
    inputRef.current?.setSelectionRange(start, end)
  }, [selection])

  const [inputValue, setInputValue] = useState<string | undefined>(defaultValue ? defaultValue : '')

  useEffect(() => {
    setInputValue(defaultValue ? defaultValue : '')
  }, [])

  const [back, setBack] = useState<boolean>(false)

  let slots = new Set(dataSlots || '_')
  let prev = (j => Array.from(placeholder, (c, i) => slots.has(c) ? j = i + 1 : j))(0)
  let first = [...placeholder].findIndex(c => slots.has(c))
  let accept = new RegExp(dataAccept || '\\d', 'g')
  let clean = (input: any) => {
    input = input.match(accept) || []
    return Array.from(placeholder, c =>
      input[0] === c || slots.has(c) ? input.shift() || c : c
    )
  }

  const format = ((e: any) => {

    const [i, j]: any = [inputRef.current?.selectionStart, inputRef.current?.selectionEnd].map((i: any) => {
      i = clean((e.target as HTMLInputElement).value.slice(0, i)).findIndex((c: any) => slots.has(c))
      return ((i < 0) ? prev[prev.length - 1] : (back ? (prev[i - 1] || first) : i))
    })

    setInputValue(() => {
      return clean((e.target as HTMLInputElement).value).join(``)
    })

    value?.(clean((e.target as HTMLInputElement).value).join(``).substring(0, inputRef.current?.selectionStart))

    setSelection({ start: i, end: j })
  })

  return (
    <>
      <input
        className={classNameForInput}
        ref={inputRef}
        value={inputValue}
        onKeyDown={e => { setBack(e.key === 'Backspace'); e.key === 'Enter' ? funcKeyDown?.(e) : setBack(e.key === 'Backspace') }}
        onInput={format}
        onFocus={format}
        onChange={() => inputRef.current?.setSelectionRange(11, 11)}
        onBlur={e => { e.target.value === placeholder && (setInputValue('')); onBlur && onBlur(e) }}
        placeholder={placeholder}
        style={styleForInput}
        onClick={(e) => value?.(inputValue)}
        name={nameInput ? nameInput : ''}
      // onClick={() => {defaultValue && setInputValue(defaultValue); inputValue !== '' && value?.(clean(inputValue).join(``))}}
      />
    </>
  )
}

export const debounce = (callback: Function, delay: number) => {
  let timeout: NodeJS.Timeout;
  return function (...args: any) {
      clearInterval(timeout);
      timeout = setTimeout(() => {
          if(document.visibilityState === 'hidden') return;
          callback(...args)
      }, delay)
  }
}

const App = () => {
  const [isValidate, setIsValidate] = useState(true);

  const testRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef(null);

  const debaunceIsValidate = useCallback(debounce(() => setIsValidate(true), 2000), []);

  useValidator({
    mainElement: document.body,
    isValidate: isValidate,
    onChange(element, value) {
      console.log((element as HTMLInputElement).name, value);
    },
  })

  const chagneVal = () => {
    setIsValidate(false);
    debaunceIsValidate();
  }

  return (
    <div ref={testRef}>
      <input type="text" name='1' defaultValue={"2024/04/22"} data-validate={1} data-typevalidate={"date"} data-validatevalue={"dd/mm/yy"} onChange={chagneVal} />
      <input type="text" name='2' defaultValue={"2024/31/31"} data-validate={1} data-typevalidate={"date"} data-validatevalue={"mm/dd/yy"} onChange={chagneVal}  />
      <form>
        <input type="text" name="fio" ref={inputRef} />
        <InputMask
          placeholder='гггг.мм.дд'
          dataSlots='ггггммдд'
          nameInput='bday'
        />
      </form>
    </div>
  )
}

export default App