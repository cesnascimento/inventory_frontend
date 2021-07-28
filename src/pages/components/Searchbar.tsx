import { AutoComplete, Input, InputProps } from 'antd'
import { SearchOutlined } from "@ant-design/icons"
import debounce from 'lodash/debounce'

interface SearchbarProps extends InputProps {
    onSearch?: (value: string) => void
}

export default function Searchbar({ onSearch = (value) => null, ...rest }: SearchbarProps) {

    return (
        <div className="searchBar searchTwo">
            <AutoComplete
                onSearch={debounce(onSearch, 300)}
            >
                <Input placeholder="Search" prefix={<SearchOutlined />} {...rest} />
            </AutoComplete>
        </div>
    )
}
