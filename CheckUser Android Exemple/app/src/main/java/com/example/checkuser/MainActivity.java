package com.example.checkuser;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

public class MainActivity extends AppCompatActivity {

    private TextView vencimentoDate;
    private TextView diasRestantes;
    private TextView avisos;
    private TextView usuario;
    private String URLcake = "http://IPVPS:6888/checkUser";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        diasRestantes = (TextView) findViewById(R.id.txtDiasRestantes);
        vencimentoDate = (TextView) findViewById(R.id.txtVencimentoDate) ;
        avisos= (TextView) findViewById(R.id.txtAvisos) ;
        usuario = (TextView) findViewById(R.id.txtUser) ;


        checkUser();//COLOQUE NO ONCREATE DO APP,E COLOQUE DENTRO DO SSH_CONECTADO PRA FAZER A REQUEST QUANDO CONECTADO A VPN
    }

    private void checkUser() {
        //final SharedPreferences prefs= mConfig.getPrefsPrivate();
        //String current_user2 = prefs.getString(Settings.USUARIO_KEY, "");//AQUI É ONDE PEGA O USUÁRIO USADO
        String current_user2 = "EXEMPLE";
        if(TextUtils.isEmpty(current_user2)){

        }else {
            //String current_user = prefs.getString(Settings.USUARIO_KEY, "");//AQUI É ONDE PEGA O USUÁRIO USADO,
            String current_user = "EXEMPLE";
            Log.i("cake2", URLcake);
            usuario.setText("Usuário:" + current_user);
            Thread thread = new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        URL url = new URL(URLcake);
                        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                        conn.setRequestMethod("POST");
                        conn.setRequestProperty("Content-Type", "application/json;charset=UTF-8");
                        conn.setRequestProperty("Accept", "application/json");
                        conn.setDoOutput(true);
                        conn.setDoInput(true);

                        JSONObject jsonParam = new JSONObject();
                        jsonParam.put("user", current_user);

                        Log.i("JSON", jsonParam.toString());

                        DataOutputStream os = new DataOutputStream(conn.getOutputStream());
                        //os.writeBytes(URLEncoder.encode(jsonParam.toString(), "UTF-8"));
                        os.writeBytes(jsonParam.toString());
                        os.flush();
                        os.close();

                        if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) {
                            try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                                String result;

                                while ((result = bufferedReader.readLine()) != null) {
                                    if (result.equals("not exist")) {
                                        runOnUiThread(new Runnable() {
                                            @Override
                                            public void run() {
                                                vencimentoDate.setVisibility(View.GONE);
                                                usuario.setVisibility(View.GONE);
                                                diasRestantes.setVisibility(View.GONE);
                                                avisos.setText("Usuário não encontrado no banco de dados!");
                                            }
                                        });

                                    } else {
                                        showUserInfo(result);
                                    }
                                    Log.d("JSON", result);

                                }
                            }
                        } else if (conn.getResponseCode() == 401) {
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    vencimentoDate.setVisibility(View.GONE);
                                    usuario.setVisibility(View.GONE);
                                    diasRestantes.setVisibility(View.GONE);
                                    avisos.setText("Ocorreu um erro ao obter as informações do login :(");
                                }
                            });
                            //ERRO NA CHECAGEM
                            // SkStatus.logInfo("Erro ao obter informações do usuários");
                        } else {
                            vencimentoDate.setVisibility(View.GONE);
                            usuario.setVisibility(View.GONE);
                            diasRestantes.setVisibility(View.GONE);
                            avisos.setText("Ocorreu um erro ao obter as informações do login :(");
                            //ERRO NA CHECAGEM
                            // SkStatus.logInfo("Erro ao obter informações do usuários");
                        }

                        conn.disconnect();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });

            thread.start();
        }
    }

    private void showUserInfo(String result) {
        //MOSTRA DATA E FAZ CHECAGEM
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        Date hoje = new Date();
        String CurrentDate = dateFormat.format(hoje);

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                //FORMATA DATA
                avisos.setText("");
                String data = formatDate(result);
                //SETA DATA DE VENCIMENTO FORMATADA NO TEXTVIEW
                vencimentoDate.setText("Vencimento: "+data);
                vencimentoDate.setVisibility(View.VISIBLE);
                usuario.setVisibility(View.VISIBLE);
                diasRestantes.setVisibility(View.VISIBLE);

                //VERIFICA DIAS RESTANTES
                try {
                    Date firstDate = sdf.parse(CurrentDate);
                    Date secondDate = sdf.parse(data);

                    long diff = secondDate.getTime() - firstDate.getTime();
                    TimeUnit time = TimeUnit.DAYS;
                    long dias_diferenca = time.convert(diff, TimeUnit.MILLISECONDS);
                    int dias_diferenca_int = (int) dias_diferenca;

                    diasRestantes.setText("Dias restantes: " + dias_diferenca_int);

                    if (dias_diferenca_int <= 3){
                        avisos.setText("Atenção!\nRestam "+ dias_diferenca_int + " dias para o vencimento do seu login!\n Por favor,contate o suporte");
                    }else{
                        avisos.setText("");
                    }


                } catch (Exception e) {
                    e.printStackTrace();
                }

            }
        });




    }

    public static String formatDate(String data){
        String dateStr = data;
        String returnString = "";
        try{
            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
            Date date = sdf.parse(dateStr);
            sdf = new SimpleDateFormat("dd/MM/yyyy");
            dateStr = sdf.format(date);
            returnString = dateStr;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return returnString;
    }