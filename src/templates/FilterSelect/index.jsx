import React from 'react';
import Select from 'antd/lib/select'
const Option = Select.Option;

export default class FilterSelect extends React.Component {
  constructor() {
    super();
    this.state = {
      options: [],
    };
  }
  componentDidMount() {
    const { options } = this.props;
    this.setState({ options });
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.options && nextProps.options !== this.props.options) {
      this.setState({ options: nextProps.options });
    }
  }
  handleDbChange = (value) => {
    const { options } = this.props;
    const item = (options.filter(item => item.value === value) || [])[0] || {
      value,
      lable: value,
    };
    this.props.onChange(value, item);
  };
  searchForOptions = (value) => {
    const {
      options,
      resultTotal,
      onSearch,
      canModify,
      allowSubFilter = false,
    } = this.props;
    if (value.length > 0) {
      const filterOptions = options.filter(
        item =>
          String(item.label)
            .toLowerCase()
            .includes(value.toLowerCase())
          || (allowSubFilter
            && item.subValue.toLowerCase().includes(value.toLowerCase())),
      );
      const fullMatch = options.filter(
        item =>
          String(item.label).toLowerCase() === value.toLowerCase()
          || (allowSubFilter
            && item.subValue.toLowerCase() === value.toLowerCase()),
      );
      const frontMatch = options.filter(
        item =>
          String(item.label)
            .toLowerCase()
            .indexOf(value.toLowerCase()) === 0
          || (allowSubFilter
            && item.subValue.toLowerCase().indexOf(value.toLowerCase()) === 0),
      );
      let newOptions = [
        ...new Set([...fullMatch, ...frontMatch, ...filterOptions]),
      ];
      if (newOptions.length === 0 && canModify) {
        newOptions = [{ value, label: value }];
      }
      this.setState({
        options: newOptions.filter((item, idx) => idx < resultTotal),
      });
      if (onSearch && onSearch instanceof Function) {
        onSearch(value);
      }
    } else {
      this.setState({
        options: this.props.options,
      });
    }
  };
  getFocusHandle = () => {
    const { options, onFocus } = this.props;
    this.setState({
      value: '',
      options,
    });
    onFocus && onFocus();
  };
  render() {
    const {
      value,
      placeholder,
      size,
      disabled,
      mode,
      notFoundContent,
      allowClear = true,
    } = this.props;
    const { options } = this.state;
    const filterOptions = [];
    options.forEach((item) => {
      if (!filterOptions.some(child => child.value === item.value)) {
        filterOptions.push(item);
      }
    });
    return (
      <Select
        style={{ width: '100%' }}
        value={value}
        mode={mode}
        allowClear={allowClear}
        onChange={this.handleDbChange}
        placeholder={placeholder}
        size={size}
        filterOption={() => true}
        notFoundContent={notFoundContent}
        onSearch={this.searchForOptions}
        onFocus={this.getFocusHandle}
        disabled={disabled}
        showSearch
      >
        {filterOptions.map(item => (
          <Option
            value={item.value}
            disabled={item.disabled || false}
            key={item.value}
          >
            {item.label}
          </Option>
        ))}
      </Select>
    );
  }
}
