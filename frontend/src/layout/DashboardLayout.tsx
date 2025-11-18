import { Box } from "@mui/material";
import { Children, type ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

const layoutSlots = [
  { key: "slot-1", area: "slot1" },
  { key: "slot-2", area: "slot2" },
  { key: "slot-3", area: "slot3" },
  { key: "slot-4", area: "slot4" },
  { key: "slot-5", area: "slot5" },
  { key: "slot-6", area: "slot6" },
  { key: "slot-7", area: "slot7" },
  { key: "slot-8", area: "slot8" },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const items = Children.toArray(children);

  return (
    <Box
      sx={{
        display: "grid",
        gap: 4,
        gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
        gridTemplateAreas: {
          xs: `"slot1" "slot2" "slot3" "slot4" "slot5" "slot6" "slot7" "slot8"`,
          md: `"slot1 slot2 slot3"
               "slot4 slot4 slot3"
               "slot5 slot5 slot6"
               "slot7 slot7 slot8"`,
        },
      }}
    >
      {layoutSlots.map((slot, index) => {
        const content = items[index];
        if (!content) {
          return null;
        }
        return (
          <Box
            key={slot.key}
            sx={{
              gridArea: slot.area,
            }}
          >
            {content}
          </Box>
        );
      })}
    </Box>
  );
}

export default DashboardLayout;
