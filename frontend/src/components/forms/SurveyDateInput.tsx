interface SurveyDateInputProps {
	value: string;
	onChange: (value: string) => void;
	label?: string;
	id?: string;
}

// Convert DD-MM-YYYY to YYYY-MM-DD for API
export const convertToApiFormat = (dateString: string): string => {
	const [day, month, year] = dateString.split("-");
	return `${year}-${month}-${day}`;
};

// Convert YYYY-MM-DD from API to DD-MM-YYYY
export const convertFromApiFormat = (dateString: string): string => {
	const [year, month, day] = dateString.split("-");
	return `${day}-${month}-${year}`;
};

export const SurveyDateInput = ({
	value,
	onChange,
	label = "Data da avaliação * (DD-MM-YYYY)",
	id = "survey_date",
}: SurveyDateInputProps) => {
	return (
		<div className="bg-neutral-50 p-4 rounded-lg">
			<label
				htmlFor={id}
				className="block text-sm font-medium text-neutral-700 mb-2"
			>
				{label}
			</label>
			<input
				type="text"
				id={id}
				value={value || ""}
				onChange={(e) => onChange(e.target.value)}
				className="input-field w-full"
				placeholder="DD-MM-YYYY (ex: 25-12-2024)"
				pattern="^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-([0-9]{4})$"
				required
			/>
			{/* <p className="text-xs text-neutral-500 mt-1">
        Formato: {value || 'DD-MM-YYYY'}
      </p> */}
		</div>
	);
};
