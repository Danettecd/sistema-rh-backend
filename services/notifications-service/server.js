const express = require('express');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'notifications-service'
  });
});

app.get('/notifications/birthdays', (req, res) => {
  res.json([
    {
      type: 'birthday',
      message: 'Recordatorio de cumpleaños del mes'
    }
  ]);
});

app.get('/notifications/documents', (req, res) => {
  res.json([
    {
      type: 'document',
      message: 'Revisar documentos próximos a vencer'
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Notifications service corriendo en puerto ${PORT}`);
});
