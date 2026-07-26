import { LinearGradient } from "expo-linear-gradient"
import { Link, router } from "expo-router"
import { useState } from "react"
import { Alert, Image, StyleSheet, Text, View } from "react-native"

import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { API_URL } from "@/services/api"

export default function IndexPage() {
    const [nome, setNome] = useState("")
     const [email, setEmail] = useState("")
       const [password, setPassword] = useState(" ")
        const [confirmarsenha, setConfirmarsenha] = useState("")
    
    
 const cadastrar = async () => {

    if( !email.trim() || !password.trim() || !nome.trim()) {
        return Alert.alert ("Entrar","Preencha todo os campos para se cadastrar")
    }
    const regex = /@gmail\.com$/

    if (!regex.test(email)) {
        alert("Use um Gmail válido")
        return
    }
    const regexSenha =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

    if (!regexSenha.test(password)) {
        alert("A senha precisa ter 8 caracteres, letras maiúsculas e minúsculas, números e caracteres especiais")
        return
    }

    if (password !== confirmarsenha) {
        alert("As senhas não coincidem")
        return
    }

    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha: password }),
        })

        const data = await response.json()

        if (!response.ok) {
            alert(data.error || "Erro ao cadastrar")
            return
        }

        alert("Cadastro realizado com sucesso")
        router.replace("/")

    } catch (erro) {
        alert("Não foi possível conectar ao servidor. Verifique se o Flask está rodando.")
        console.log(erro)
    }
}
    return(

<LinearGradient colors={['#000166', '#0002CC']} style={styles.container}>
        <View>
            <Image source={require("../assets/logo voando.png")} style={styles.image}/>
            <Text style={styles.title}>Cadastre-se!</Text>
            <Text style={styles.subtitle}>Crie uma conta para começar a aprender!</Text>

            <View style={styles.form}>
               <Text style={styles.suptext}>Nome:</Text>
               <Input
                placeholder=" "
                value={nome}
                onChangeText={setNome}
                />

                <Text style={styles.suptext}>Email:</Text>
                <Input 
                    placeholder=" " 
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={setEmail}
                />

                <Text style={styles.suptext}>Senha:</Text>
                <Input 
                    placeholder=" "    
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}

                />

                <Text style={styles.suptext}>Confrimar senha:</Text>
                <Input 
                    placeholder=" " 
                    secureTextEntry
                    value={confirmarsenha}
                    onChangeText={setConfirmarsenha}
                />

                <Button    
                    label="Cadastrar"
                    onPress={cadastrar}
                />
            </View>

        <Text style={styles.footerText}>

            Já tem uma conta?{" "}
            <Link href="/" style={styles.footerLink}>Clique aqui!</Link>

        </Text>

    </View>
</LinearGradient>
    
   
)
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent:"center",
        alignItems:"center",


    },

    image: {
        width: 100,
        height: 100,
        position:"absolute",
        top: 45,
        marginLeft: 250
    },

    title: {
        color:'#fff',
        fontSize: 24,
        fontWeight: "bold" 
        
    },

    subtitle:{
        color:'#fff',
        fontSize: 18,
        fontWeight: "bold"
    },

    suptext:{
        color:'#fff',

    },
    
    form:{
        marginTop:24,
        gap: 12,
       
    },

    footerText:{
        textAlign:"center",
        color:"#fff"

    },

    footerLink:{
        textAlign:"center",
        color:"#FFC43F",
        fontWeight: 700
     
    }


})

