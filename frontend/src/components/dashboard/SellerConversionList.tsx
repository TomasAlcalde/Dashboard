import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { useSellerConversion } from "../../api/clients";

const formatPercent = (value: number) =>
  `${(value * 100).toFixed(1).replace(/\.0$/, "")}%`;

type RankStyle = {
  size: number;
  fontSize: number;
};

const rankStyles: RankStyle[] = [
  { size: 60, fontSize: 20},
  { size: 52, fontSize: 18},
  { size: 46, fontSize: 16},
];

const getRankStyle = (index: number): RankStyle => {
  if (index < rankStyles.length) {
    return rankStyles[index];
  }
  return { size: 40, fontSize: 14};
};

const buildAvatarSrc = (name: string, index: number) =>
  `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
    name || `seller-${index}`
  )}`;

const SellerConversionList = () => {
  const { data, isLoading } = useSellerConversion();
  const sellers = data?.items ?? [];

  const bestSeller = sellers[0];

  return (
    <Paper sx={{ p: 3, borderRadius: 3, height: 470, display: "flex", flexDirection: "column" }}>
      <Stack spacing={1} mb={2}>
        <Typography variant="h5" fontWeight={700}>
          Conversión por vendedor
        </Typography>
      </Stack>
      {isLoading ? (
        <Skeleton variant="rounded" height={200} sx={{ borderRadius: 2 }} />
      ) : sellers.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No hay vendedores con registros de cierre.
        </Typography>
      ) : (
        <List dense sx={{ flex: 1, overflowY: "auto" }}>
          {sellers.map((seller, index) => {
            const rank = index + 1;
            const rankStyle = getRankStyle(index);
            return (
            <ListItem
              key={seller.seller}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: "background.paper",
              }}
              disableGutters
            >
              <ListItemAvatar>
                <Avatar
                  src={buildAvatarSrc(seller.seller, index)}
                  sx={{
                    width: rankStyle.size,
                    height: rankStyle.size,
                    bgcolor: "background.paper",
                    mr: 2
                  }}
                  className="border-primary"
                >
                  {seller.seller
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      #{rank} {seller.seller}
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {seller.closed} cerrados / {seller.total} total
                  </Typography>
                }
              />
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ fontSize: rankStyle.fontSize, minWidth: 80, textAlign: "right" }}
              >
                {formatPercent(seller.conversion)}
              </Typography>
            </ListItem>
          );
          })}
        </List>
      )}
    </Paper>
  );
};

export default SellerConversionList;
