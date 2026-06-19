import { expect, test } from "@playwright/test";

for (const viewport of [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1920, height: 1080 }
]) {
  test(`renders shell at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/es");

    await expect(page.getByRole("heading", { name: "Panel operativo" })).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Buscar módulos, cuentas o acciones" })).toBeVisible();
    await expect(page.getByText("Sin datos de aplicación todavía")).toBeVisible();
  });
}

test("renders the framework module grid", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/es");

  const table = page.getByRole("table", { name: "Módulos framework" });

  await expect(table).toBeVisible();
  await expect(table.getByRole("columnheader", { name: "Módulo" })).toBeVisible();
  await expect(table.getByRole("columnheader", { name: "Código" })).toBeVisible();
  await expect(table.getByRole("cell", { exact: true, name: "custom-field" })).toBeVisible();
});
