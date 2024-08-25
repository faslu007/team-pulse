import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, FormHelperText } from '@mui/material';

interface SelectComponentProps {
    id: string | number;
    name: string;
    label: string;
    value: string | number;
    options: { id: string | number; label: string, disabled?: boolean }[];
    onChange: (event: SelectChangeEvent<string | number>) => void;
    fullWidth?: boolean;
    minWidth?: string | number;
    disabled?: boolean;
    helperText?: string;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
    id,
    name,
    label,
    value,
    options,
    onChange,
    fullWidth = true,
    minWidth = '100%',
    disabled,
    helperText
}) => {
    return (
        <FormControl sx={{ minWidth }}>
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <Select
                disabled={disabled}
                id={`single-select-box-${id}`}
                name={name}
                labelId={`${label}-label`}
                value={value.toString()}
                fullWidth={fullWidth}
                label={label}
                onChange={(event) => onChange(event as SelectChangeEvent<string | number>)}
            >
                {options.map((option) => (
                    <MenuItem key={option.id} value={option.id} disabled={option.disabled}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default SelectComponent;
