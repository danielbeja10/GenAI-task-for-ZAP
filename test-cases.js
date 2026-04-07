// 5 test cases, each targeting a distinct edge case category.
// Each case has: input (free-form text), expected (canonical names the AI should return).
// Used both by the dropdown in index.html and the test runner in test-runner.html.

const TEST_CASES = [
  {
    id: 1,
    name: "Hebrew / English merges",
    description: "Same product written in Hebrew and English across three categories — all should merge.",
    input:
`Apple AirPods Pro
אפל אירפודס פרו
Sony WH-1000XM5
סוני אוזניות ביטול רעש WH-1000XM5
Dyson V15 Detect
דייסון V15 דיטקט`,
    expected: [
      "Apple AirPods Pro",
      "Sony WH-1000XM5",
      "Dyson V15 Detect"
    ]
  },

  {
    id: 2,
    name: "Spec variants — must stay separate",
    description: "Same iPhone model in different storage sizes. The Hebrew entry pairs with 256GB. All four should remain distinct.",
    input:
`iPhone 15 Pro 128GB
iPhone 15 Pro 256GB
אייפון 15 פרו 256 גיגה
iPhone 15 Pro 512GB
iPhone 15 Pro Max`,
    expected: [
      "Apple iPhone 15 Pro 128GB",
      "Apple iPhone 15 Pro 256GB",
      "Apple iPhone 15 Pro 512GB",
      "Apple iPhone 15 Pro Max"
    ]
  },

  {
    id: 3,
    name: "Typos + brand name correction",
    description: "Three brands with spelling mistakes. The AI must fix the typo and merge the Hebrew variant.",
    input:
`Samsong Galaxy S24
סמסונג גלקסי S24
Nikey Air Max 90
נייקי אייר מקס 90
Adidass Ultraboost 22`,
    expected: [
      "Samsung Galaxy S24",
      "Nike Air Max 90",
      "Adidas Ultraboost 22"
    ]
  },

  {
    id: 4,
    name: "Mixed delimiters",
    description: "Commas, semicolons, and no newlines — the AI must parse the format and still identify duplicates.",
    input: `LG OLED C3 55, טלוויזיה LG אולד C3 55 אינץ; Sony Bravia XR A95L 65, סוני ברביה 65 אינץ; Samsung Neo QLED 75`,
    expected: [
      "LG OLED C3 55",
      "Sony Bravia XR A95L 65",
      "Samsung Neo QLED 75"
    ]
  },

  {
    id: 5,
    name: "Home appliances + unpaired Hebrew items",
    description: "Some items have both Hebrew and English (merge), others appear only in Hebrew (translate but don't invent details).",
    input:
`מקרר סמסונג 500 ליטר
Samsung Refrigerator 500L
מכונת כביסה LG
כיסא גיימינג
Gaming Chair
מסך מחשב`,
    expected: [
      "Samsung Refrigerator 500L",
      "LG Washing Machine",
      "Gaming Chair",
      "Computer Monitor"
    ]
  }
];
