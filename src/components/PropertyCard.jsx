import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InfoRounded from '@mui/icons-material/InfoRounded';

function PropertyCard() {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 1,
        boxShadow: '0 1px 3px rgba(0, 127, 255, 0.1)',
        display: 'flex',
        flexDirection: {
          xs: 'column', // mobile
          sm: 'row', // tablet and up
        },
      }}
    >
      <CardMedia
        component="img"
        width="100"
        height="100"
        alt="123 Main St, Phoenix, AZ cover"
        src="/static/images/cards/real-estate.png"
        sx={{
          borderRadius: 0.5,
          width: { xs: '100%', sm: 100 },
          mr: { sm: 1.5 },
          mb: { xs: 1.5, sm: 0 },
        }}
      />
      <Box sx={{ alignSelf: 'center', ml: 2 }}>
        <Typography variant="body2" color="text.secondary" fontWeight="medium">
          123 Main St, Phoenix, AZ
        </Typography>
        <Typography fontWeight="bold" noWrap>
          $280k - $310k
        </Typography>
        <Box
          sx={(theme) => ({
            mt: 1,
            py: 0.4,
            pl: 0.5,
            pr: 1,
            typography: 'caption',
            borderRadius: 10,
            display: 'flex',
            bgcolor: 'primary.50',
            border: '1px solid',
            borderColor: 'primary.100',
            color: 'primary.700',
            ...theme.applyDarkStyles({
              bgcolor: 'primaryDark.700',
              color: 'primary.200',
              borderColor: 'primary.900',
            }),
          })}
        >
          <InfoRounded sx={{ fontSize: 16, mr: 0.5, mt: '1px' }} />
          Confidence score: 85%
        </Box>
      </Box>
    </Card>
  );
}

export default PropertyCard;
