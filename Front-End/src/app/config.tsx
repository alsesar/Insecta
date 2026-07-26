import { LinearGradient } from "expo-linear-gradient"
import { Link } from "expo-router"
import { Alert, Image, StyleSheet, Text, View } from "react-native"




export default function IndexPage() {
    const Iniciar = () => {
        Alert.alert(":(","Não temos níveis disponíveis!")

    }
function Social() {
    Alert.alert(":(","Página indisponível no momento")
}


    return(

<LinearGradient colors={['#000166', '#0002CC']} style={styles.container}>
    <View style={styles.upBar}></View>
    <Link href="/main" style={styles.configL}><Image source={require("../assets/logolinhayellow.png")} style={styles.config} /></Link>
        
    <View style={styles.card}></View>
            <Text style={styles.title}>Sobre:</Text>
            <Text style={styles.sobre}>
            Mantis é uma equipe formada por Adriel Veiga, Alice Cezar de Souza, Bryan Chagas, Felipe S. Santos e Thainá D. Chaves, estudantes do 3DSEM da Etec de Praia Grande.
            Mantis é uma aplicação dedicada a tornar o conhecimento em informática mais acessível para todos. Nosso projeto nasceu da ideia de que aprender o básico sobre tecnologia não deve ser algo complicado ou distante da realidade das pessoas.
            </Text>
            <Image source= {require("../assets/logoempeolhandopracima.png")} style={styles.joana} />
    <View style={styles.downBar}></View>

</LinearGradient>
    
   

)
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent:"center",
        alignItems:"center",
        padding: 20


    },

    upBar: {
        backgroundColor:"black",
        padding: 70,
        borderRadius: 10,
        position:"absolute",
        marginBottom: 800,
        width:500

    },

    card: {
        backgroundColor:"#1B1B1B",
        padding: 150,
        borderRadius: 20,
        position:"absolute",
        height:600,
        width:350

    
    },

    miniCard: {
        backgroundColor:"black",
        padding: 10,
        borderRadius: 20,
        position:"absolute",
        height: 250,
        marginTop:150,
        width:300,
        borderWidth: 2,
        borderColor:"#FFC43F",
    },

    title: {
        color:'#fff',
        fontSize: 24,
        fontWeight: "bold", 
        position:"absolute",
        marginBottom:500,

        
    },

    sobre: {
        color:'#fff',
        fontSize: 16,
        fontWeight: "bold", 
        position:"absolute",
        marginBottom:250,
        marginLeft:15

        
    },

    topCard: {
        backgroundColor:"black",
        padding: 1,
        borderRadius: 20,
        position:"absolute",
        width:300,
        marginBottom:150,
        height: 100

    },

    coin:{
        width:100,
        height:100,
        position:"absolute",
    },


    joana:{
        width:200,
        height:200,
        marginTop:415
    },

    start:{
        backgroundColor:"#FFC43F",
        marginTop:320,
        width: 300,
        height: 48,
        borderRadius: 8,
    },

    config:{
        width:80,
        height:80
    },

    configL:{
    position:"absolute",
    marginBottom:730,

    },

    social:{
        width:35,
        height:35
    },

    socialL:{
    position:"absolute",
    marginRight:200,
    marginTop:750
    },

    home:{
        width:30,
        height:30,

    },

    homeL:{
    position:"absolute",
    marginTop:750
    },

    user:{
        width:30,
        height:30
    },

    userL:{
    position:"absolute",
    marginLeft:200,
    marginTop:750
    },

    downBar: {
    backgroundColor:"black",
    padding: 50,
    borderRadius: 10,        position:"absolute",
    marginTop: 800,
    width:500



        
        
    },
    
    },



)