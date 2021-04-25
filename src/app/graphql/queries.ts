import gql from "graphql-tag";

export const LoginMutation = gql`
    mutation LoginMutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                usuario_id
                email
                nombre
                apellido1
                apellido2
                telefono
                rol_id
            }
        }
    }
`;