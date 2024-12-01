import Select from "react-select";

type MultiSelectProps = {
  options: { value: number; label: string }[];
  value: number[];
  onChange: (values: number[]) => void;
};

export const MultiSelect = ({ options, value, onChange }: MultiSelectProps) => {
  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  return (
    <Select
      isMulti
      options={options}
      value={selectedOptions}
      onChange={(selected) => onChange(selected.map((sel) => sel.value))}
      className="react-select"
      classNamePrefix="select"
    />
  );
};
