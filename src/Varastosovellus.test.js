import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Varasto from "./Varastosovellus";

describe("Testit Varasto-komponentille", () => {
  test("Renderöidään komponentti, tarkistetaan teksti", () => {
    render(<Varasto />);
    expect(screen.getByText("Varastoinfo")).toBeInTheDocument();
    expect(screen.queryByText("Täytä kaikki tiedot: ")).not.toBeInTheDocument();
  });
  test("Yritetään lisätä tuote ilman tietoja, tarkistetaan teksti", async () => {
    render(<Varasto />);
    expect(screen.getByText("Varastoinfo")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("tallenna"));
    expect(screen.getByText("Täytä kaikki tiedot")).toBeInTheDocument();
  });
});
