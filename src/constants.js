export const rules = {
  searchInput: [
    {
      min: 1,
      message: "min 1 number",
    },
    {
      max: 10,
      message: "max 10 number",
    },
    {
      pattern: /^[0-9]*$/,
      message: "It`s not a number",
    }
  ],
  select:[{ required: true, message: 'Please select' }],
  deliveryDate:[{ required: true, message: 'Please select date' }],

}