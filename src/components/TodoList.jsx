"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Paper,
  Fab,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
  ListAlt as ListAltIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

// Hook reutilizable para persistir tareas
const useLocalStorageTasks = (key, defaultTasks = []) => {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultTasks;
    } catch {
      return defaultTasks;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(tasks));
  }, [key, tasks]);

  return [tasks, setTasks];
};

export default function TodoList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Estado de tareas persistente
  const [tasks, setTasks] = useLocalStorageTasks("mi-todo-tasks", [
    { id: 1, text: "Terminar diseño de app", completed: false },
    { id: 2, text: "Comprar café", completed: true },
    { id: 3, text: "Llamar a Madre", completed: false },
  ]);

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  // Cálculo derivado (no usar useState innecesario)
  const tasksCompleted = useMemo(
    () => tasks.filter((t) => !t.completed).length,
    [tasks]
  );

  const filtered = useMemo(() => {
    switch (filter) {
      case "active":
        return tasks.filter((t) => !t.completed);
      case "completed":
        return tasks.filter((t) => t.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  // Acciones principales
  const addTask = () => {
    if (!input.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), text: input.trim(), completed: false },
    ]);
    setInput("");
  };

  const toggleTask = (id) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const deleteTask = (id) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));
  const clearCompleted = () =>
    setTasks((prev) => prev.filter((t) => !t.completed));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: isMobile ? 2 : 8,
        pb: isMobile ? 10 : 8,
        px: 2,
        bgcolor: "#f4f6f8",
      }}>
      <Paper
        elevation={4}
        sx={{
          width: { xs: "100%", sm: "90%", md: 420 },
          maxWidth: "100%",
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
        }}>
        <Typography variant="h5" fontWeight="700" mb={2} textAlign="center">
          Mis Tareas
        </Typography>

        <Box display="flex" gap={1} mb={2} alignItems="center">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Agregar nueva tarea..."
            size={isMobile ? "small" : "medium"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            inputProps={{ "aria-label": "Agregar nueva tarea" }}
          />

          {!isMobile && (
            <IconButton color="primary" onClick={addTask} aria-label="Agregar">
              <AddIcon />
            </IconButton>
          )}
        </Box>

        <List sx={{ mb: 1 }}>
          {filtered.length === 0 ? (
            <Box sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
              <ListAltIcon sx={{ fontSize: 40, opacity: 0.25 }} />
              <Typography variant="body2" mt={1}>
                No hay tareas aquí
              </Typography>
            </Box>
          ) : (
            filtered.map((t) => (
              <ListItem
                key={t.id}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: "background.default",
                  px: 1,
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => deleteTask(t.id)}
                    aria-label="Eliminar">
                    <DeleteIcon />
                  </IconButton>
                }>
                <Checkbox
                  checked={t.completed}
                  onChange={() => toggleTask(t.id)}
                />
                <ListItemText
                  primary={t.text}
                  primaryTypographyProps={{
                    sx: {
                      textDecoration: t.completed ? "line-through" : "none",
                      color: t.completed ? "text.disabled" : "text.primary",
                    },
                  }}
                />
              </ListItem>
            ))
          )}
        </List>

        {/* Filtros y acciones */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2">
            {tasksCompleted} tareas pendientes
          </Typography>

          <Box display="flex" gap={1}>
            {["all", "active", "completed"].map((type) => (
              <Button
                key={type}
                variant="outlined"
                size="small"
                onClick={() => setFilter(type)}
                color={filter === type ? "primary" : "inherit"}>
                {type === "all"
                  ? "Todas"
                  : type === "active"
                  ? "Pendientes"
                  : "Completadas"}
              </Button>
            ))}
          </Box>
        </Box>

        {tasks.some((t) => t.completed) && (
          <Button
            variant="text"
            onClick={clearCompleted}
            startIcon={<RestoreIcon />}
            sx={{ mt: 1 }}>
            Eliminar completadas
          </Button>
        )}
      </Paper>

      {isMobile && (
        <>
          <Fab
            color="primary"
            aria-label="Agregar tarea"
            onClick={addTask}
            sx={{ position: "fixed", right: 18, bottom: 78 }}>
            <AddIcon />
          </Fab>

          <Paper
            elevation={6}
            sx={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 0,
              zIndex: 1200,
            }}>
            <BottomNavigation
              showLabels
              value={filter}
              onChange={(e, val) => setFilter(val)}>
              <BottomNavigationAction
                label="Todas"
                value="all"
                icon={<ListAltIcon />}
              />
              <BottomNavigationAction
                label="Pend."
                value="active"
                icon={<CheckCircleOutlineIcon />}
              />
              <BottomNavigationAction
                label="Comp."
                value="completed"
                icon={<DeleteIcon />}
              />
            </BottomNavigation>
          </Paper>
        </>
      )}
    </Box>
  );
}
