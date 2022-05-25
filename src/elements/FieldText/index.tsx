export default function FieldText({
    label,
    value,
    handleChange,
    name,
}) {
    return (
        <div>
        <label className="label">{label}</label>
                    <input 
                      name={name} 
                      type="text"
                      value={value}
                      onChange={handleChange}
                    />
        </div>
    );
}
