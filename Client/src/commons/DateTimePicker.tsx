import React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { SxProps, Theme } from '@mui/material';

interface ReusableDateTimePickerProps {
    name: string;
    label: string;
    value: Date | null;
    onChange: (newValue: Date | null) => void;
    minDate?: Date | null;
    maxDate?: Date | null;
    minDateTime?: Date | null;
    maxDateTime?: Date | null;
    disablePast?: boolean;
    disableFuture?: boolean;
    timezone?: string;
    format?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError?: (reason: any) => void;
    helperText?: string;
    required?: boolean;
    fullWidth?: boolean;
    sx?: SxProps<Theme>;
}

const DateTimePickerCommon: React.FC<ReusableDateTimePickerProps> = ({
    name,
    label,
    value,
    onChange,
    minDate = null,
    maxDate = null,
    minDateTime = null,
    maxDateTime = null,
    disablePast,
    disableFuture,
    timezone,
    onError,
    helperText,
    required = false,
    fullWidth = true,
}) => {
    const minDateValue = minDate ?? undefined;
    const maxDateValue = maxDate ?? undefined;
    const minDateTimeValue = minDateTime ?? undefined;
    const maxDateTimeValue = maxDateTime ?? undefined;

    return (
        <DateTimePicker
            label={label}
            value={value}
            onChange={(newValue) => onChange(newValue)}
            minDate={minDateValue}
            maxDate={maxDateValue}
            minDateTime={minDateTimeValue}
            maxDateTime={maxDateTimeValue}
            disablePast={disablePast}
            disableFuture={disableFuture}
            onError={onError}
            timezone={timezone}
            slotProps={{
                textField: {
                    helperText: helperText,
                    required: required,
                    name: name,
                    fullWidth: fullWidth,
                },
            }}
        />
    );
};

export default DateTimePickerCommon;
