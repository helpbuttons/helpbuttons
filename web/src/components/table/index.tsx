import { BtnAction } from "elements/Btn"
import { useEffect } from "react"
import { IoArrowBack, IoArrowForward } from "react-icons/io5"

export function Table({ children }) {
    return <div className='form-list__wrapper'>
        <table className='form-list__table'>{children}</table>
    </div>
}

export function TableHeader({ children }) {
    return <thead className='form-list__table-header'>
        <tr className='form-list__table-header-row'>{children}</tr></thead>
}

export function TableHeaderCell({ children }) {
    return <th className='form-list__table-header-cell'>{children}</th>
}

export function TableBody({ children }) {
    return <tbody className='form-list__table-body'>{children}</tbody>
}


export function TableLine({ children }) {
    return <tr className='form-list__table-body-row'>{children}</tr>
}

export function TableLineCell({ children }) {
    return <td className='form-list__table-body-cell'>
        {children}
    </td>
}

export function Pagination({ page, setPage, array, take }) {
    return (<>
      {page > 0 &&
        <BtnAction
          icon={<IoArrowBack />}
          onClick={() => setPage((prevPage) => prevPage - 1)}
        />
      }
      {(array && array.length > 0 && array.length == take) &&
        <BtnAction
          icon={<IoArrowForward />}
          onClick={() => setPage((prevPage) => prevPage + 1)}
        />
      }
    </>
    )
  }

  export function useFilterItems(setItems, pageItems, searchString, compFunc) {
    useEffect(() => {
        if (!searchString) {
            setItems(() => pageItems)
        } else {
            setItems(() => pageItems.filter((item) => {
                if(compFunc(searchString, item))
                {
                    return true;
                }
                return false;
            }))
        }
    }, [searchString, pageItems])
}

