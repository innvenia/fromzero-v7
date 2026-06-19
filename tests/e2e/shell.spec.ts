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
