import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";

export type FilterOption = {
  value: string;
  label: string;
};

export type FilterField = {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

type ClientsFiltersProps = {
  filters: FilterField[];
};

const ClientsFilters = ({ filters }: ClientsFiltersProps) => (
  <Stack
    direction="row"
    spacing={2}
    flexWrap="nowrap"
    alignItems="center"
    sx={{
      width: "auto",
      minWidth: "fit-content",
      maxWidth: "100%",
      flex: "0 0 auto",
      overflowX: "auto",
      py: 0.5,
    }}
  >
    {filters.map((filter) => (
      <FilterSelect key={filter.id} {...filter} />
    ))}
  </Stack>
);

const FilterSelect = ({
  label,
  value,
  onChange,
  options,
}: FilterField) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: "auto",
        flex: "0 0 auto",
      }}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={handleChange}
        sx={{
          minWidth: "fit-content",
          "& .MuiSelect-select": {
            px: 2,
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ClientsFilters;
