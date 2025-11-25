export interface Product {
  id: string;
  name: string;
  cases: number;
  units: number;
}

export const products: Product[] = [
  { id: 'P001', name: 'Arroz largo fino', cases: 10, units: 100 },
  { id: 'P002', name: 'Fideos secos', cases: 8, units: 80 },
  { id: 'P003', name: 'Aceite de girasol', cases: 12, units: 72 },
  { id: 'P004', name: 'Azúcar común', cases: 15, units: 150 },
  { id: 'P005', name: 'Harina de trigo 000', cases: 20, units: 200 },
  { id: 'P006', name: 'Sal fina', cases: 10, units: 100 },
  { id: 'P007', name: 'Yerba mate', cases: 18, units: 90 },
  { id: 'P008', name: 'Café instantáneo', cases: 6, units: 60 },
  { id: 'P009', name: 'Leche larga vida', cases: 24, units: 240 },
  { id: 'P010', name: 'Galletitas dulces', cases: 14, units: 140 },
  { id: 'P011', name: 'Conserva de atún', cases: 10, units: 60 },
  { id: 'P012', name: 'Tomate en lata', cases: 12, units: 72 },
  { id: 'P013', name: 'Mayonesa', cases: 8, units: 48 },
  { id: 'P014', name: 'Salsa de tomate', cases: 10, units: 60 },
  { id: 'P015', name: 'Jabón en pan', cases: 16, units: 160 },
  { id: 'P016', name: 'Detergente líquido', cases: 10, units: 50 },
  { id: 'P017', name: 'Papel higiénico', cases: 20, units: 240 },
  { id: 'P018', name: 'Toallas de papel', cases: 12, units: 96 },
  { id: 'P019', name: 'Lavandina', cases: 10, units: 60 },
  { id: 'P020', name: 'Cereal para desayuno', cases: 6, units: 36 },
];
