import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { register } from "../api/authService";


export default function Register() {
  const navigate = useNavigate();

  //Estado do formulário
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
  });

  //Armazena erros de cada campo e erros gerais
  const [errors, setErrors] = useState({});
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  //Validação de cada campo isolado
  function validateField(name, value) {
    const newErrors = { ...errors };

    if (name === "email") {
      if (!value.trim()) {
        newErrors.email = "O e-mail é obrigatório";
      } else if (!emailRegex.test(value)) {
        newErrors.email = "Digite um e-mail válido.";
      } else {
        delete newErrors.email;
      }
    }

    if (name === "password") {
      if (!value.trim()) {
        newErrors.password = "Senha é obrigatória.";
      } else if (value.length < 4) {
        newErrors.password = "Senha deve ter pelo menos 4 caracteres.";
      } else {
        delete newErrors.password;
      }
    }

    if (name === "confirm") {
      if (!value.trim()) {
        newErrors.confirm = "A confirmação de senha é obrigatória.";
      } else if (value !== form.password) {
        newErrors.confirm = "As senhas não coincidem.";
      } else {
        delete newErrors.confirm;
      }
    }

    setErrors(newErrors);
  }

  //Atualiza estado e valida em tempo real
  function handleChange(e) {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
    validateField(name, value);
  }

  //Validação completa ao enviar
  function validateBeforeSubmit() {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "O e-mail é obrigatório";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Digite um e-mail válido.";
    }

    if (!form.password.trim()) {
      newErrors.password = "Senha é obrigatória.";
    } else if (form.password.length < 4) {
      newErrors.password = "Senha deve ter pelo menos 4 caracteres.";
    }

    if (!form.confirm.trim()) {
      newErrors.confirm = "A confirmação de senha é obrigatória.";
    } else if (form.password !== form.confirm) {
      newErrors.confirm = "As senhas não coincidem.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (!validateBeforeSubmit()) return;

    try {
      await register(form);
      alert("Conta criada com sucesso!");
      navigate("/");
    } catch {
      setErrors({ general: "Erro ao criar conta." });
    }
  }


  return (
    <div className="page-center">
      <div className="card-panel auth">
        <Logo size={90} />

        <p className="muted">Crie sua conta para entrar na Lumen.</p>

        <form onSubmit={handleRegister} className="form">
          
          {/* Campo email */}
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="ex: voce@email.com"
          />
          {errors.email && <div className="error">{errors.email}</div>}

          {/* Campo senha */}
          <label>Senha</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="mínimo 4 caracteres"
          />
          {errors.password && <div className="error">{errors.password}</div>}

          {/* Campo confirmação */}
          <label>Confirmar senha</label>
          <input
            type="password"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            placeholder="repita sua senha"
          />
          {errors.confirm && <div className="error">{errors.confirm}</div>}

          {/* Erro geral */}
          {errors.general && <div className="error">{errors.general}</div>}

          <button className="btn">Criar conta</button>
        </form>

        <div className="register-hint">
          Já tem conta?{" "}
          <span className="register-link" onClick={() => navigate("/")}>
            Entrar
          </span>
        </div>
      </div>
    </div>
  );
}