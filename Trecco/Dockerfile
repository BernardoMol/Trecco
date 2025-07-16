# Stage 1 - Build
FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
WORKDIR /app

# Copia os projetos necessários
COPY ./BibliotecaSUPABASE ./BibliotecaSUPABASE
COPY ./ApiTreccoRENDER ./ApiTreccoRENDER

# Restaura e publica a API
WORKDIR /app/ApiTreccoRENDER
RUN dotnet restore
RUN dotnet publish -c Release -o /app/out

# Stage 2 - Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview
WORKDIR /app

# Copia a aplicação publicada
COPY --from=build /app/out .

# 🔥 Garante que os appsettings.json sejam copiados — caso o publish falhe
COPY ./ApiTreccoRENDER/appsettings.json .
COPY ./ApiTreccoRENDER/appsettings.Development.json .

ENTRYPOINT ["dotnet", "ApiTreccoRENDER.dll"]
