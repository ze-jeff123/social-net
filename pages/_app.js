import { ChakraProvider, extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
    styles: {
        global : () => ({
            body : {
                bg : "#F6F6F6"
            }
        })
    }
})
export default function MyApp({ Component, pageProps }) {
    return (
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    )
}